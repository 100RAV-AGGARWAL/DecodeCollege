const { User } = require('../models');
const authService = require('../services/auth.service');
const { to, ReE, ReS } = require('../services/util.service');
const { sendEmail } = require("../lib/sendemail");
const { getTemplateHtml } = require("../lib/emailTemplate");
const logger = require("../lib/logging");
const config = require('config');
var crypto = require('crypto');
var base64url = require('base64url');

const create = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let err, verification;

	const body = req.body;

	if (!body.unique_key && !body.email && !body.phone) {
		logger.error("User Controller - create : Email not provided ");
		return ReE(res, 'Please enter an email to register.');
	} else if (!body.password) {
		logger.error("User Controller - create : password not provided ");
		return ReE(res, 'Please enter a password to register.');
	} else if (body.password != body.retypedpassword) {
		logger.error("User Controller - create : Password does not match ");
		return ReE(res, 'Password does not match.');
	} else {
		let user;
		let activationToken = base64url(crypto.randomBytes(20));
		body.activationToken = activationToken;
		[err, user] = await to(authService.createUser(body));
		if (err) {
			logger.error("User Controller - create : Unable to create user ", err);
			return ReE(res, err, 422);
		}
		signupHTMLcontent(user.email, user.first, user.activationToken)
		return ReS(res, { message: 'Successfully created new user.', user: user.toObject(), token: user.getJWT() }, 201);
	}
}
module.exports.create = create;

const get = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let user = req.user;

	return ReS(res, { user: user.toObject() });
}
module.exports.get = get;

const update = async function (req, res) {
	let err, user, data, response
	user = req.user;
	data = req.body;

	if (data.first)
		user.first = data.first;

	if (data.last)
		user.last = data.last;

	if (data.emailnotification)
		user.emailnotification = data.emailnotification;

	if (data.password) {
		user.password = data.password;
		if (data.password != data.retypedpassword) {
			logger.error("User Controller - create : Password does not match ");
			return ReE(res, new Error('Password does not match.'), 422);
		}
	}

	[err, user] = await to(user.save());
	if (err) {
		logger.error("User Controller - Update : Unable to update the user ", err);
		return ReE(res, err, 422);
	}
	return ReS(res, { message: 'Updated User: ' + user.email });
}
module.exports.update = update;

const login = async function (req, res) {
	const body = req.body;
	let err, user;

	[err, user] = await to(authService.authUser(req.body));
	if (err) {
		logger.error("User Controller - login : Unable to login the user", err);
		return ReE(res, err, 422);
	}

	return ReS(res, { token: user.getJWT(), user: user.toObject(), totalTime: config.get("jwt").expiration });
}
module.exports.login = login;

const getPublicInfo = async function (userId) {
	let err, user;
	[err, user] = await to(User.findById(userId));
	if (err && !user) {
		logger.error("User Controller - getPublicInfo : Unable to find the user", err);
		throw err;
	}
	return {
		id: user._id,
		_id: user._id,
		first: user.first,
		last: user.last,
		email: user.email,
		createdAt: user.createdAt
	}

}
module.exports.getPublicInfo = getPublicInfo;

const profile = async function (req, res) {
	let user_id, err, user;
	user_id = req.query._id;
	[err, user] = await to(getPublicInfo(user_id));
	if (err) {
		logger.error("User Controller - profile : Unable to find the user", err);
		return ReE(res, err.message);
	}
	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { user: user });

}
module.exports.profile = profile;

const getUserList = async function (req, res) {
	let userList;

	[err, userList] = await to(User.find());
	if (err) {
		logger.error("User Controller - getUserList : Unable to find the users", err);
		return {};
	}

	let userObject = {};
	for (let user of userList) {
		userObject[user._id] = user;
	}

	return userObject;
}
module.exports.getUserList = getUserList;

const signupHTMLcontent = function (emailId, firstname, token) {
	let htmlContent;

	let signuplist = [];
	signuplist.push(emailId);
	let serverDomain = config.get("serverDomain");
	let ejObj = {
		emailId: emailId,
		firstname: firstname,
		activationUrl: serverDomain + "/api/users/activation?token=" + token
	};
	htmlContent = getTemplateHtml(ejObj, "signup");
	sendEmail(signuplist, "Signup", "Succesfuly Signed Up", htmlContent);
}

const findByPk = async function (id) {
	let err, user;

	[err, user] = await to(User.findById(id));
	if (err || !user) {
		logger.error("User Controller - findByPk : Unable to find the user", err);
		throw new Error("User not found with id : " + id);
	}
	return user;
}
module.exports.findUserById = findByPk;

const updateOtherUser = async function (req, res) {
	let err, user, data
	data = req.body;

	if (!data || !data._id) {
		logger.error("User Controller - updateOtherUser : Unable to find the user", err);
		throw new Error("User not found");
	}
	[err, user] = await to(findByPk(data._id));
	if (err) {
		logger.error("User Controller - updateOtherUser : Unable to find the user", err);
		throw new Error("User not found with id : " + id);
	}

	user.first = data.first;
	user.last = data.last;
	user.emailnotification = data.emailnotification;
	user.blocked = data.blocked;
	user.isActivated = data.isActivated;
	user.role = data.role;

	[err, user] = await to(user.save());
	if (err) {
		logger.error("User Controller - updateOtherUser : Unable to update the user ", err);
		return ReE(res, err, 422);
	}
	return ReS(res, { message: 'Updated User: ' + user.email });
}
module.exports.updateOtherUser = updateOtherUser;


const userList = async function (req, res) {
	let userList;

	var limit = req.query.limit
		? req.query.limit < 20 && req.query.limit > 0
			? parseInt(req.query.limit)
			: 20
		: 20;
	var offset = req.query.offset
		? req.query.offset > 0
			? parseInt(req.query.offset)
			: 0
		: 0;
	if (!req.user.id) {
		return ReE(res, err, 401);
	}

	[err, userList] = await to(User.find({}).limit(limit).skip(offset));
	if (err) {
		logger.error("User Controller - userList : Users not found ", err);
		return ReE(res, err, 422);
	}

	[err, count] = await to(User.countDocuments({}));
	if (err) {
		logger.error("User Controller - userList : User count not found ", err);
		return ReE(res, err, 422);
	}

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { user: JSON.stringify(userList), count: count });
};
module.exports.userList = userList;

const getUser = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let err, user, data
	data = req.query;

	if (!data || !data._id) {
		logger.error("User Controller - getUser : Unable to find the user", err);
		throw new Error("User not found");
	}
	[err, user] = await to(findByPk(data._id));
	if (err) {
		logger.error("User Controller - getUser : Unable to find the user", err);
		throw new Error("User not found with id : " + id);
	}

	return ReS(res, { user: user.toObject() });
}
module.exports.getUser = getUser;

const userActivation = async function (req, res) {
	if (req.query.token) {
		[err, user] = await to(User.findOne({ activationToken: req.query.token }));
		if (err) {
			logger.error("User Controller - getUser : Unable to find the user", err);
			return ReS(res, 'Unable to activate the user. Please try later');
		}
		user.isActivated = true;
		user.activationToken = null;
		[err, user] = await to(user.save());
		if (err) {
			logger.error("User Controller - getUser : Unable to save the user", err);
			return ReS(res, 'Unable to activate the user. Please try later');
		} else {
			req.session.message = 'Successfully activated. Please login.';
			req.session.login = { token: user.getJWT(), user: user.toObject(), totalTime: config.get("jwt").expiration };
		}
	}
}
module.exports.userActivation = userActivation;