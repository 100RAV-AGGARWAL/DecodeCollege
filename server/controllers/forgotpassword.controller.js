const { to, ReE, ReS } = require("../services/util.service");
const { User } = require("../models");
const { sendEmail } = require("../lib/sendemail");
const { getTemplateHtml } = require("../lib/emailTemplate");
const logger = require("../lib/logging");
var crypto = require('crypto');
const config = require('config');

const forgotpassword = async function (req, res) {
	if (!req.body.email) {
		logger.error("ForgotPassword Controller : forgotpassword - Email not provided", err)
		return ReE(res, new Error("Email not provided"), 422);
	}
	[err, token] = await to(new Promise((resolve, reject) => {
		crypto.randomBytes(20, function (err, buf) {
			if (err) {
				reject(err);
			} else {
				var token = buf.toString("hex");
				resolve(token);
			}
		});
	}));
	if (err) {
		logger.error("ForgotPassword Controller : forgotpassword - Could not generate forgot password token", err)
		return ReE(res, err, 422);
	}
	[err, user] = await to(User.findOne({ email: req.body.email, isActivated: true, blocked: false }));
	if (err || !user) {
		logger.error("ForgotPassword Controller : forgotpassword - Could not find user for this email id", err);
		return ReE(res, "User not found", 422);
	}
	user.resetPasswordToken = token;
	user.resetPasswordExpires = Date.now() + config.get("forgotPasswordTime");

	[err, user] = await to(user.save());
	if (err) {
		logger.error("ForgotPassword Controller : forgotpassword - Could not reset password", err);
		return ReE(res, "Could not reset password", 422);
	}
	resetPasswordHTMLcontent(user.email, token);
	return ReS(res, { message: 'Forgot password link email sent on registered email id.' }, 200);
}
module.exports.forgotPassword = forgotpassword;

const resetTokenVerify = async function (req, res) {
	if (!req.body.token) {
		logger.error("ForgotPassword Controller : resetTokenVerify - Token not provided", err)
		return ReE(res, new Error("Email not provided"), 422);
	}
	[err, user] = await to(User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }));
	if (err || !user) {
		logger.error("ForgotPassword Controller : resetTokenVerify - Password reset token has expired", err)
		return ReE(res, new Error("Password reset token has expired"), 422);
	}
	return ReS(res, { message: 'Token is valid' }, 200);
}
module.exports.resetTokenVerify = resetTokenVerify;

const resetPassword = async function (req, res) {
	if (!req.body.token) {
		logger.error("ForgotPassword Controller : resetPassword - Token not provided", err)
		return ReE(res, new Error("Token not provided"), 422);
	}
	[err, user] = await to(User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }));
	if (err || !user) {
		logger.error("ForgotPassword Controller : resetPassword - Password reset token has expired", err)
		return ReE(res, new Error("Password reset token has expired"), 422);
	}

	user.password = req.body.newpassword;
	if (user.password !== req.body.retypepassword) {
		logger.error("ForgotPassword Controller : resetPassword - Password do not match", err)
		return ReE(res, new Error("Password do not match"), 422);
	};
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	[err, user] = await to(user.save());
	if (err) {
		logger.error("ForgotPassword Controller : resetPassword - Unable to reset the password", err)
		return ReE(res, new Error("Unable to reset the password"), 422);
	}
	passwordConfirmationHTMLcontent(user.email, user.first);
	return ReS(res, { message: 'Password reset successfully. Please login' }, 200);
}
module.exports.resetPassword = resetPassword;

const resetPasswordHTMLcontent = function (emailId, token) {
	let htmlContent;

	let resetPasswordlist = [];
	resetPasswordlist.push(emailId);
	let serverDomain = config.get("serverDomain");

	let ejObj = {
		emailId: emailId,
		token: token,
		forgotPasswordUrl: serverDomain + "/user/reset/" + token

	};
	htmlContent = getTemplateHtml(ejObj, "resetpassword");
	sendEmail(
		resetPasswordlist,
		"Reset Password Link",
		"Link for Reset Password",
		htmlContent
	);
};

const passwordConfirmationHTMLcontent = function (emailId, firstname) {
	let htmlContent;
	let resetPasswordlist = [];

	resetPasswordlist.push(emailId);
	let ejObj = {
		emailId: emailId,
		firstname: firstname,
	};
	htmlContent = getTemplateHtml(ejObj, "passwordconfirmation");
	sendEmail(
		resetPasswordlist,
		"passwordconfirmation",
		"Password has been changed",
		htmlContent
	);
};