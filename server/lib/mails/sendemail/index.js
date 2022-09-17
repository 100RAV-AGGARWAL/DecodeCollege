const nodemailer = require("nodemailer");
const config = require("config");
let email_config = config.get("email");
const logger = require("../../lib/logging");

const email = async function (toList, from, subject, html, text) {
	//toList is an Array. from will be a name.
	let sender = email_config.emailIds[from];
	if (!sender) {
		sender = {
			username: email_config.username,
			password: email_config.password,
		};
	}
	let mailTransporter = nodemailer.createTransport({
		service: email_config.service,
		auth: {
			user: email_config.username,
			pass: email_config.password,
		},
	});
	for (let user of toList) {
		if (html) {
			mailDetails = {
				from: sender.username,
				to: user,
				subject: subject,
				html: html,
			};
		} else {
			mailDetails = {
				from: sender.username,
				to: user,
				subject: subject,
				text: text,
			};
		}
		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) {
				logger.error("Sendemail email - Error while sending mail to user", err, mailDetails)
			} else {
				logger.info("Email sent successfully");
			}
		});
	}
};
module.exports.sendEmail = email;
