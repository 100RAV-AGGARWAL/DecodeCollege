'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('config');
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	first: { type: String, required: [true, 'First name is required'] },
	last: { type: String, required: [true, 'Last name is required'] },
	email: { type: String, allowNull: true, required: [true, 'Email is required'] },
	phone: { type: String, allowNull: true, required: [true, 'Phone is required'] },
	password: { type: String, allowNull: true, required: [true, 'Password is required'] },
	role: { type: String, enum: ['superuser', 'admin', 'user'], default: "user" },
	emailnotification: { type: String, enum: ['daily', 'weekly', 'never'], default: "daily" },
	blocked: { type: Boolean, default: false },
	isActivated: { type: Boolean, default: false },
	activationToken: { type: String, allowNull: true },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
}, { timestamps: true })


userSchema.pre('save', async function (error, doc, next) {
	let err, user;
	[err, user] = await to(mongoose.models["User"].find({ email: this.email }));
	if (user && user.length > 0 && !user[0]._id.equals(this._id)) {
		TE("Email is already used", true);
	}
	if (this.isModified('password')) {
		let salt, hash
		[err, salt] = await to(bcrypt.genSalt(10));
		if (err) TE(err.message, true);

		[err, hash] = await to(bcrypt.hash(this.password, salt));
		if (err) TE(err.message, true);

		this.password = hash;
	}
	doc.role = "user";
	next();
});
userSchema.methods.comparePassword = async function (pw) {
	let err, pass
	if (!this.password) TE('password not set');

	[err, pass] = await to(bcrypt_p.compare(pw, this.password));
	if (err) TE(err);

	if (!pass) TE('invalid password');

	return this;
};

userSchema.methods.getJWT = function () {
	let expiration_time = parseInt(CONFIG.get("jwt").expiration);
	return "Bearer " + jwt.sign({ user_id: this._id }, CONFIG.get("jwt").secretKey, { expiresIn: expiration_time });
};

const User = mongoose.model('User', userSchema);
module.exports = User;