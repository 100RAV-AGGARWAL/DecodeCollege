const { to, ReE, ReS } = require('../services/util.service');
const { Doubt, User, Subject } = require('../models');
const logger = require("../lib/logging");


const create = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let err, doubts;
	const body = req.body;
	if (!body) {
		logger.error("Doubt Controller - create : Request body is empty");
		return ReE(res, new Error("Request body is empty"), 422);
	}
	if (!body.topic) {
		logger.error("Doubt Controller - create : Not able to read topic");
		return ReE(res, new Error("Not able to read topic"), 401);
	}
	if (!body.description) {
		logger.error("Doubt Controller - create : Not able to read description");
		return ReE(res, new Error("Not able to read description"), 401);
	}

	body.status = "unsolved";
	body.raisedBy = req.user.id;

	[err, doubts] = await to(Doubt.create(body));
	if (err) {
		logger.error("Doubt Controller - create : Not able to save the doubt ", err);
		return ReE(res, err, 422);
	}
	let doubtJson = doubts.toObject();

	return ReS(res, { message: 'Successfully created new Doubt.', doubt: doubtJson }, 201);
}

module.exports.create = create;

const get = async function (req, res) {
	let err, doubt, subject;
	if (!req.query._id) {
		logger.error("Doubt Controller - get : Doubt Id is empty");
		return ReE(res, err, 422);
	}

	[err, doubts] = await to(findByPk(req.query._id, req.user.role));
	if (err) {
		logger.error("Doubt Controller - get : Doubt not found ", err);
		return ReE(res, err, 422);
	}
	let doubtsJson = doubts.toObject()
	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { doubts: doubtsJson });
}
module.exports.get = get;

const findByPk = async function (id, role) {
	if (role !== "academic-support" && role !== "customer-support") {
		throw new Error("You are not authorized to perform this action");
	}

	let err, doubts;
	if (!id) {
		logger.error("Doubt Controller - findByPk : Doubt Id is empty");
		throw new Error("doubts Id is empty")
	}

	[err, doubts] = await to(Doubt.findById(id));
	if (err || !doubts) {
		logger.error("Doubt Controller - findByPk : Doubt not found ", err);
		throw new Error("Doubt not found");
	}
	return doubts;
}
module.exports.findByPk = findByPk;

const listAcademicDoubts = async function (req, res) {
	let doubtsList, doubtsCount;
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	[err, doubtsList] = await to(Doubt.find({ status: { "$in": ["unsolved", "accepted"] }, topic: "academic-support" }).sort('-1').limit(limit).skip(offset));

	if (err) {
		logger.error("Doubt Controller - list : Doubt not found ", err);
		return ReE(res, err, 422);
	}

	[err, doubtsCount] = await to(Doubt.find().count());

	if (err) {
		logger.error("Doubt Controller - list : Doubt count not found ", err);
		return ReE(res, err, 422);
	}
	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { doubt: JSON.stringify(doubtsList), total: doubtsCount });
}

module.exports.listAcademicDoubts = listAcademicDoubts;

const listUserDoubts = async function (req, res) {
	let doubtsList, doubtsCount;
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	[err, doubtsList] = await to(Doubt.find({ status: "unsolved", user: req.user.id }).sort().limit(limit).skip(offset));

	if (err) {
		logger.error("Doubt Controller - list : Doubt not found ", err);
		return ReE(res, err, 422);
	}

	[err, doubtsCount] = await to(Doubt.find().count());

	if (err) {
		logger.error("Doubt Controller - list : Doubt count not found ", err);
		return ReE(res, err, 422);
	}
	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { doubt: JSON.stringify(doubtsList), total: doubtsCount });
}

module.exports.listUserDoubts = listUserDoubts;

const solveDoubt = async function (req, res) {
	let err, doubts;
	if (!req.query._id) {
		logger.error("Doubt Controller - get : Doubt Id is empty");
		return ReE(res, err, 422);
	}

	[err, doubts] = await to(Doubt.deleteOne({ _id: req.query._id }));
	if (err) {
		logger.error("Doubt Controller - get : Doubt not solved", err);
		return ReE(res, err, 422);
	}

	return ReS(res, { message: 'Doubt Solved' }, 204);
}

module.exports.solveDoubt = solveDoubt;

const acceptAcademicDoubt = async function (req, res) {
	let err, doubts;
	if (!req.body.id) {
		logger.error("Doubt Controller - get : Doubt Id is empty");
		return ReE(res, err, 422);
	}

	[err, doubts] = await to(findByPk(req.body.id, req.user.role));
	if (err) {
		logger.error("Doubt Controller - get : Doubt not found ", err);
		return ReE(res, err, 422);
	}

	doubts.status = "accepted";
	doubts.assignedTo = req.user.id;

	[err, savedDoubts] = await to(doubts.save());
	if (err) {
		logger.error("Doubt Controller - get : Doubt not solved", err);
		return ReE(res, err, 422);
	}

	return ReS(res, { message: 'Doubt Accepted' }, 204);
}

module.exports.acceptAcademicDoubt = acceptAcademicDoubt;