const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../models');
const CONFIG = require('config');
const { to } = require('../services/util.service');
const logger = require("../lib/logging");

module.exports = function (passport) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

	opts.secretOrKey = CONFIG.get("jwt").secretKey;
	passport.use(new Strategy(opts, async function (jwt_payload, done) {
		let err, user;

		[err, user] = await to(User.findById(jwt_payload.user_id));
		if (err) {
			logger.error("Passport : Could not find user");
			return done(err, false);
		}

		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	}));
}
