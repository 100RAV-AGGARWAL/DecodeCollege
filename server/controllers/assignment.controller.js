const { to, ReE, ReS } = require("../services/util.service");
const { Assignment, User, File } = require("../models");
const { findSubjectById } = require("./subject.controller");
const { getPublicInfo } = require("./user.controller");
const { getSubjectInfo } = require("./subject.controller");
const logger = require("../lib/logging");
const { sendEmail } = require("../lib/mails/sendemail");
const { getTemplateHtml } = require("../lib/mails/emailTemplate");
const UploadController = require('./upload.controller');

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

	assignment.createdById = req.user.id;
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

	let assignmentJson = assignment.toObject();

	[err, user] = await to(getPublicInfo(assignmentJson.createdById));

	if (req.user.id != user._id) {
		logger.error("User not authorized to view");
		return ReE(res, "User not authorized to view");
	}

	[err, subject] = await to(getSubjectInfo(assignment.subjectId));

	assignmentJson.user = user;
	assignmentJson.subject = subject;

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

	if (!req.user) {
		logger.error("No user found");
		return ReE(res, "No user found");
	}

	let body = req.body;

	assignment_id = body._id;

	[err, assignment] = await to(findByPk(assignment_id));
	if (err) return ReE(res, err.message);

	if (!assignment._id == req.user.id) {
		return ReE(res, "User not authorized to edit");
	}

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

	assignment.set(req.body);
	assignment.subjectId = req.body.subject._id;

	if (body.deadline >= new Date()) {
		assignment.status = "PENDING";
	} else {
		assignment.status = "MISSED";
	}

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
	let assignment_id, err, assignment, file_id;
	assignment_id = req.query.assignmentId;
	file_id = req.query.fileId;

	if (!file_id) {
		logger.error("File id is required");
		return ReE(res, "File Id is required");
	}

	let fileModel;
	[err, fileModel] = await to(File.findById(file_id));
	if (err) {
		logger.error("File not found");
		return ReE(res, "File not found");
	}

	let userId = fileModel.name.split("-")[0];
	if (userId != req.user.id) {
		logger.error("User not authorized to delete");
		return ReE(res, "You are not authorized to delete this file");
	}

	let fileIns;
	[err, fileIns] = await to(UploadController.removeFile(file_id));
	if (err) {
		logger.error("Error deleting file");
	}

	[err, assignment] = await to(Assignment.deleteOne({ _id: assignment_id }));
	if (err) {
		logger.error("Error deleting assignment");
		return ReE(res, err);
	}

	return ReS(res, { message: 'Deleted assignment' }, 204);
}
module.exports.remove = remove;

// const listPending = async function (req, res) {
// 	let assignmentList;
// 	var limit = req.query.limit
// 		? req.query.limit < 20 && req.query.limit > 0
// 			? parseInt(req.query.limit)
// 			: 20
// 		: 20;
// 	var offset = req.query.offset
// 		? req.query.offset > 0
// 			? parseInt(req.query.offset)
// 			: 0
// 		: 0;

// 	[err, assignmentList] = await to(
// 		Assignment.find({
// 			status: "PENDING"
// 		}).limit(limit).skip(offset)
// 	);
// 	if (err) return ReE(res, err.message);

// 	res.setHeader("Content-Type", "application/json");

// 	return ReS(res, { assignment: JSON.stringify(assignmentList) });
// };

// module.exports.listPending = listPending;

// const listSubmitted = async function (req, res) {
// 	let assignmentList;
// 	var limit = req.query.limit
// 		? req.query.limit < 20 && req.query.limit > 0
// 			? parseInt(req.query.limit)
// 			: 20
// 		: 20;
// 	var offset = req.query.offset
// 		? req.query.offset > 0
// 			? parseInt(req.query.offset)
// 			: 0
// 		: 0;

// 	[err, assignmentList] = await to(
// 		Assignment.find({
// 			status: "SUBMITTED"
// 		}).limit(limit).skip(offset)
// 	);
// 	if (err) return ReE(res, err.message);

// 	res.setHeader("Content-Type", "application/json");

// 	return ReS(res, { assignment: JSON.stringify(assignmentList) });
// };

// module.exports.listSubmitted = listSubmitted;

// const listMissed = async function (req, res) {
// 	let assignmentList;
// 	var limit = req.query.limit
// 		? req.query.limit < 20 && req.query.limit > 0
// 			? parseInt(req.query.limit)
// 			: 20
// 		: 20;
// 	var offset = req.query.offset
// 		? req.query.offset > 0
// 			? parseInt(req.query.offset)
// 			: 0
// 		: 0;

// 	[err, assignmentList] = await to(
// 		Assignment.find({
// 			status: "MISSED"
// 		}).limit(limit).skip(offset)
// 	);
// 	if (err) return ReE(res, err.message);

// 	res.setHeader("Content-Type", "application/json");

// 	return ReS(res, { assignment: JSON.stringify(assignmentList) });
// };

// module.exports.listMissed = listMissed;

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

	var sortOrder = req.query.order ? req.query.order : "asc";
	var sortCriteria = req.query.sort && req.query.sort != 'undefined' ? req.query.sort : "deadline";

	[err, assignmentList] = await to(
		Assignment.find({
			userId: req.user.id,
		}).limit(limit).skip(offset).sort({ [sortCriteria]: sortOrder })
	);
	if (err) return ReE(res, err.message);

	let assignmentJson = assignmentList.map(assignment => {
		return assignment.toObject();
	});
	for (let index in assignmentJson) {
		[err, subject] = await to(getSubjectInfo(assignmentJson[index].subjectId));
		if (err) return ReE(res, err.message);

		assignmentJson[index].subject = {
			_id: subject._id,
			name: subject.name,
			subjectcode: subject.subjectcode,
			credits: subject.credits,
			semester: subject.semester,
		};
	}


	[err, assignmentCount] = await to(Assignment.find({ userId: req.user.id }).count());
	if (err) {
		logger.error("Assignment Controller - myAssignments : Assignments count not found", err);
		return ReE(res, err, 422);
	}

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { assignment: JSON.stringify(assignmentJson), total: assignmentCount });
};

module.exports.myAssignments = myAssignments;

const mailList = async () => {
	let assignmentList;
	let someDate = new Date();
	let numberOfDaysToAdd = 3;
	let result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

	let newDate = new Date(result);
	newDate.setSeconds(0);
	newDate.setHours(0);
	newDate.setMinutes(0);

	let todayDate = new Date();
	todayDate.setSeconds(0);
	todayDate.setHours(0);
	todayDate.setMinutes(0);


	[err, assignmentList] = await to(Assignment.find());
	if (err) {
		console.log(err);
		return;
	}

	for (let assignment of assignmentList) {
		let user, firstname, emailId;
		let info;

		if (assignment.deadline.getTime() >= todayDate.getTime() && assignment.deadline.getTime() <= newDate.getTime()) {
			console.log('Due Assignment Deadline:', assignment.deadline);

			[err, user] = await to(User.findById(assignment.createdById));
			if (err) {
				console.log(err);
				return err;
			}

			info = assignment;
			emailId = user.email;
			firstname = user.first;

			dueAssignmentHTMLcontent(emailId, firstname, info);
		}
	}

}
module.exports.mailList = mailList;

const dueAssignmentHTMLcontent = function (emailId, firstname, assignment) {
	let htmlContent;

	let emailList = [];
	emailList.push(emailId);
	let ejObj = {
		emailId: emailId,
		firstname: firstname,
		assignment: assignment

	};
	htmlContent = getTemplateHtml(ejObj, "assignmentDeadline");
	sendEmail(emailList, "assignmentDeadline", "Assignment Due", htmlContent);
}

