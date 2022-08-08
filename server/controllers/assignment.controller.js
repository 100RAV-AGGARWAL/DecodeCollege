const { to, ReE, ReS } = require("../services/util.service");
const { Assignment, User } = require("../models");
const { findSubjectById } = require("./subject.controller");
const { getPublicInfo } = require("./user.controller");
const { getSubjectInfo } = require("./subject.controller");
const logger = require("../lib/logging");

const create = async function (req, res) {
	res.setHeader("Content-Type", "application/json");
	const body = req.body;

	if (!req.user) {
		logger.error("No user found");
		return ReE(res, "No user found");
	}

	let err, assignment, subject;
	if (!body.name) {
		logger.error("Assignment name is required");
		return ReE(res, "Assignment name is required");
	}
	if (!body.deadline) {
		logger.error("Assignment deadline is required");
		return ReE(res, "Assignment deadline is required");
	}
	if (!body.subject._id) {
		logger.error("Assignment subject is required");
		return ReE(res, "Assignment subject is required");
	}

	body.deadline = new Date(body.deadline);

	[err, assignment] = await to(Assignment.create(body));
	if (err) {
		return ReE(res, err, 422);
	}

	[err, subject] = await to(findSubjectById(body.subject._id));
	if (err) {
		return ReE(res, err.message);
	}

	if (body.deadline >= new Date()) {
		assignment.status = "PENDING";
	} else {
		assignment.status = "MISSED";
	}

	assignment.createById = req.user.id;
	assignment.subjectId = subject._id;

	[err, assignment] = await to(assignment.save());
	if (err) {
		return ReE(res, err, 422);
	}

	let assignmentJson = assignment.toObject();
	assignmentJson.users = [{ user: req.user.id }];
	assignmentJson.subject = [{ subject: subject._id }];

	return ReS(
		res,
		{ message: "Successfully created new assignment.", assignment: assignmentJson },
		201
	);
};
module.exports.create = create;

const get = async function (req, res) {
	let assignment_id, err, assignment, user;
	assignment_id = req.query._id;

	[err, assignment] = await to(findByPk(assignment_id));
	if (err) return ReE(res, err.message);

	[err, user] = await to(getPublicInfo(assignment.createdById));
	[err, subject] = await to(getSubjectInfo(assignment.subjectId));

	let assignmentJson = assignment.toObject();

	assignmentJson.user = user;
	assignmentJson.subject = subject;
	res.setHeader("Content-Type", "application/json");
	[err, savedassignment] = await to(assignment.save());
	return ReS(res, { assignment: assignmentJson });
};
module.exports.get = get;

const findByPk = async function (id) {
	let assignment_id, err, assignment;
	assignment_id = id;

	[err, assignment] = await to(Assignment.findById(assignment_id));

	if (err) throw new Error("err finding assignment");
	if (!assignment) throw new Error("Assignment not found with id: " + assignment_id);

	return assignment;
};
module.exports.findAssignmentById = findByPk;

const update = async function (req, res) {
	let assignment_id, err, assignment, savedassignment;
	assignment_id = req.body._id;

	[err, assignment] = await to(findByPk(assignment_id));
	if (err) return ReE(res, err.message);

	if (!assignment.userId.equals(req.user.id)) {
		return ReE(res, "User not authorized to edit");
	}
	assignment.set(req.body);
	assignment.status = "PENDING";

	[err, savedassignment] = await to(assignment.save());
	if (err) {
		if (err.message == "Validation error")
			err = "The assignment is already in use";
		return ReE(res, err);
	}
	return ReS(res, { message: "Updated Assignment: " + assignment.subjectId });
};
module.exports.update = update;

const remove = async function (req, res) {
	let assignment_id, err, assignment;
	assignment_id = req.query._id;

	[err, assignment] = await to(findByPk(assignment_id));
	if (err) return ReE(res, err.message);

	[err, assignment] = await to(assignment.destroy());
	if (err) return ReE(res, 'error occured trying to delete assignment');

	return ReS(res, { message: 'Deleted assignment' }, 204);
}
module.exports.remove = remove;

const listPending = async function (req, res) {
	let assignmentList;
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

	[err, assignmentList] = await to(
		Assignment.find({
			status: "PENDING"
		}).limit(limit).skip(offset)
	);
	if (err) return ReE(res, err.message);

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { assignment: JSON.stringify(assignmentList) });
};

module.exports.listPending = listPending;

const listSubmitted = async function (req, res) {
	let assignmentList;
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

	[err, assignmentList] = await to(
		Assignment.find({
			status: "SUBMITTED"
		}).limit(limit).skip(offset)
	);
	if (err) return ReE(res, err.message);

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { assignment: JSON.stringify(assignmentList) });
};

module.exports.listSubmitted = listSubmitted;

const listMissed = async function (req, res) {
	let assignmentList;
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

	[err, assignmentList] = await to(
		Assignment.find({
			status: "MISSED"
		}).limit(limit).skip(offset)
	);
	if (err) return ReE(res, err.message);

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { assignment: JSON.stringify(assignmentList) });
};

module.exports.listMissed = listMissed;

const myAssignments = async function (req, res) {
	let assignmentList;

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

	[err, assignmentList] = await to(
		Assignment.find({
			userId: req.user.id,
		}).limit(limit).skip(offset)
	);
	if (err) return ReE(res, err.message);

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { assignment: JSON.stringify(assignmentList) });
};

module.exports.myAssignments = myAssignments;

