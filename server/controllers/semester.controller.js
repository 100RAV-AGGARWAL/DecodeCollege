const { to, ReE, ReS } = require('../services/util.service');
const { Semester, User } = require('../models');
const { getPublicInfo, findUserById } = require("./user.controller");
const { getSubjectInfo } = require("./subject.controller");
const logger = require("../lib/logging");

const create = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let err;
	const body = req.body;

	let semester, subject, response;
	if (!body.sem_no) {
		logger.error("Semester Controller - create : Semester Number is not provided");
		return ReE(res, new Error("Semester Number is not provided"), 422);
	}
	if (body.sem_marks.length == 0) {
		logger.error("Semester Controller - create : Marks are not provided");
		return ReE(res, new Error("Marks are not provided"), 422);
	}
	if (!req.user.id) {
		logger.error("Semester Controller - create : User not logged in");
		return ReE(res, new Error("User is not logged in"), 401);
	}

	for (let mark of body.sem_marks) {
		[err, subject] = await to(getSubjectInfo(mark.subjectId));
		if (err) {
			logger.error(`Semester Controller - create : Subject with Id (${mark.subjectId}) not found`, err);
			return ReE(res, err, 422);
		}
	}

	body.createdById = req.user.id;

	[err, semester] = await to(Semester.create(body));
	if (err) {
		logger.error("Semester Controller - create : Unable to save semester", err);
		return ReE(res, err, 422);
	}

	let semesterJson = semester.toObject();

	//code to calculate grade to be added here

	return ReS(res, { message: 'Successfully created new semester.', semester: semesterJson }, 201);
}

module.exports.create = create;

const get = async function (req, res) {

	let semester_no, err, semester, user;
	if (!req.query.semester_no) {
		logger.error("Semester Controller - get : Semester Number is not provided");
		return ReE(res, new Error("Semester Number is not provided"), 422);
	}

	semester_no = req.query.semester_no;

	[err, semester] = await to(findBySemNo(semester_no));
	if (err) {
		logger.error("Semester Controller - get : Semester not found", err);
		return ReE(res, err, 422);
	}
	[err, user] = await to(getPublicInfo(semester.createdById));
	if (err) {
		logger.error("Semester Controller - get : Semester user not found", err);
		return ReE(res, err, 422);
	}

	for (let i = 0; i < semester.sem_marks.length; i++) {
		[err, subject] = await to(getSubjectInfo(semester.sem_marks[i].subjectId));
		if (err) {
			logger.error("Semester Controller - get : Semester subject not found", err);
			return ReE(res, err, 422);
		}

		semester.sem_marks[i].subjectName = subject.name;
	}

	// semesterJson.sem_marks.forEach(async (mark) => {
	// 	[err, subject] = await to(getSubjectInfo(mark.subjectId));
	// 	if (err) {
	// 		logger.error("Semester Controller - get : Semester subject not found", err);
	// 		return ReE(res, err, 422);
	// 	}

	// 	mark.subjectName = subject.name;
	// });

	let semesterJson = semester.toObject()
	semesterJson.user = user

	return ReS(res, { semester: semesterJson }, 201);
}
module.exports.get = get;

const findBySemNo = async function (sem_no) {
	let err, semester;

	[err, semester] = await to(Semester.findOne({ sem_no: sem_no }));
	if (err || !semester) {
		logger.error("Semester Controller - findBySemNo : Semester not found", err);
		throw new Error("Semester not found");
	}
	return semester;
}
module.exports.findSemesterByNo = findBySemNo;

const update = async function (req, res) {
	let semester_no, err, semester, savedsemester, subject;
	if (!req.body.sem_no) {
		logger.error("Semester Controller - update : Semester Number is not provided");
		return ReE(res, new Error("Semester Number is not provided"), 422);
	}
	if (req.body.sem_marks.length == 0) {
		logger.error("Semester Controller - update : Marks are not provided");
		return ReE(res, new Error("Marks are not provided"), 422);
	}
	if (!req.user.id) {
		logger.error("Semester Controller - update : User not logged in");
		return ReE(res, new Error("User is not logged in"), 401);
	}
	semester_no = req.body.sem_no;

	[err, semester] = await to(findBySemNo(semester_no));
	if (err) {
		logger.error("Semester Controller - update : Semester not found", err);
		return ReE(res, err, 422);
	}

	if (!semester.createdById || !semester.createdById.equals(req.user.id)) {
		logger.error("Semester Controller - update : User not authorized to edit this semester", err);
		return ReE(res, "User not authorized to edit this semester", 422);
	}

	for (let mark of req.body.sem_marks) {
		if (!mark.subjectId) {
			logger.error("Semester Controller - update : Subject is not provided");
			return ReE(res, new Error("Subject is not selected"), 422);
		}

		[err, subject] = await to(getSubjectInfo(mark.subjectId));
		if (err) {
			logger.error(`Semester Controller - create : Subject with Id (${mark.subjectId}) not found`, err);
			return ReE(res, err, 422);
		}
	}

	semester.sem_marks = req.body.sem_marks;

	[err, savedSem] = await to(semester.save());
	if (err) {
		logger.error("Semester Controller - update : Semester count not be saved", err);
		return ReE(res, err, 422);
	}
	return ReS(res, { message: 'Updated Subject: ' + semester.sem_no });
}
module.exports.update = update;

const remove = async function (req, res) {
	let sem_no, err, semester;
	if (!req.query.semester_no) {
		logger.error("Semester Controller - remove : Semester Number is not provided");
		return ReE(res, new Error("Semester Number is not provided"), 422);
	}
	sem_no = req.query.semester_no;

	[err, semester] = await to(findBySemNo(sem_no));
	if (err) {
		logger.error("Semester Controller - remove : Semester not found", err);
		return ReE(res, err, 422);
	}
	if (!semester.createdById || !semester.createdById.equals(req.user.id)) {
		logger.error("Semester Controller - remove : User not authorized to remove this semester", err);
		return ReE(res, "User not authorized to remove this semester", 422);
	}
	[err, semester] = await to(Semester.deleteOne({ sem_no: sem_no }));
	if (err) {
		logger.error("Semester Controller - remove : Semester could not be deleted", err);
		return ReE(res, err, 422);
	}
	return ReS(res, { message: 'Deleted semester' + sem_no }, 204);
}
module.exports.remove = remove;

const list = async function (req, res) {

	let semesterList, semesterCount;
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	[err, semesterList] = await to(Semester.find().sort({ sem_no: -1 }).limit(limit).skip(offset));
	if (err) {
		logger.error("Semester Controller - list : Semesters not found", err);
		return ReE(res, err, 422);
	}
	[err, semesterCount] = await to(Semester.find().count());
	if (err) {
		logger.error("Semester Controller - list : Semester count not found", err);
		return ReE(res, err, 422);
	}
	res.setHeader('Content-Type', 'application/json');

	return ReS(res, { semester: JSON.stringify(semesterList), total: semesterCount });
}

module.exports.list = list;

const mysemesters = async function (req, res) {
	let semesterList, semesterCount;

	if (!req.user.id) {
		logger.error("Semester Controller - create : User not logged in", err);
		return ReE(res, err, 401);
	}
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	[err, semesterList] = await to(Semester.find({ createdById: req.user.id }).limit(limit).skip(offset));
	if (err) {
		logger.error("Semester Controller - mysemesters : Semesters not found", err);
		return ReE(res, err, 422);
	}

	[err, semesterCount] = await to(Semester.find({ creeatedById: req.user.id }).count());
	if (err) {
		logger.error("Semester Controller - mysemesters : Semesters count not found", err);
		return ReE(res, err, 422);
	}

	res.setHeader('Content-Type', 'application/json');

	return ReS(res, { semester: JSON.stringify(semesterList), total: semesterCount });
}

module.exports.mySemesters = mysemesters;