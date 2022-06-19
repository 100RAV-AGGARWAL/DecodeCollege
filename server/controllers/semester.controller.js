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

	[err, semester] = await to(Semester.findOne({ sem_no: semester_no }));
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

	let semesterJson = semester.toObject()
	semesterJson.user = user

	return ReS(res, { semester: semesterJson }, 201);
}
module.exports.get = get;

const findByPk = async function (id) {
	let semester_id, err, semester;
	semester_id = id;

	[err, semester] = await to(Semester.findById(semester_id));
	if (err || !semester) {
		logger.error("Semester Controller - findByPk : Semester not found", err);
		throw new Error("Semester not found");
	}
	return semester;
}
module.exports.findSemesterById = findByPk;

// const update = async function (req, res) {
// 	let semester_id, err, semester, savedarticle, subject;
// 	if (!req.body._id) {
// 		logger.error("Semester Controller - update : Semester Id is not provided");
// 		return ReE(res, new Error("Semester Id is not provided"), 422);
// 	}
// 	if (!req.user.id) {
// 		logger.error("Semester Controller - update : User not logged in");
// 		return ReE(res, new Error("User is not logged in"), 401);
// 	}
// 	semester_id = req.body._id;

// 	[err, semester] = await to(findByPk(semester_id));
// 	if (err) {
// 		logger.error("Semester Controller - update : Semester not found", err);
// 		return ReE(res, err, 422);
// 	}

// 	if (!semester.userId || !semester.userId.equals(req.user.id)) {
// 		logger.error("Semester Controller - update : User not authorized to edit this semester", err);
// 		return ReE(res, "User not authorized to edit this semester", 422);
// 	}

// 	if (!req.body.subjectId) {
// 		logger.error("Semester Controller - update : Subject is not provided");
// 		return ReE(res, new Error("Subject is not selected"), 422);
// 	}
// 	[err, subject] = await to(findSubjectById(req.body.subjectId));
// 	if (err) {
// 		logger.error("Semester Controller - update : Subject not found", err);
// 		return ReE(res, err, 422);
// 	}
// 	let response;
// 	[err, response] = await to(shudhikaran(req.body.content, semester, req.user.id, "semester"));
// 	if (!err) {
// 		semester.content = response.content;
// 	} else {
// 		semester.content = req.body.content;
// 	}
// 	[err, response] = await to(shudhikaran(req.body.title, semester, req.user.id, "semester"));
// 	if (!err) {
// 		semester.title = response.content;
// 	} else {
// 		semester.title = req.body.title;
// 	}
// 	[err, response] = await to(shudhikaran(req.body.description, semester, req.user.id, "semester"));
// 	if (!err) {
// 		semester.description = response.content;
// 	} else {
// 		semester.description = req.body.description;
// 	}
// 	[err, response] = await to(shudhikaran(req.body.tags, semester, req.user.id, "semester"));
// 	if (!err) {
// 		semester.tags = response.content;
// 	} else {
// 		semester.tags = req.body.tags;
// 	}
// 	semester.imageId = req.body.imageId;
// 	semester.imageUrl = req.body.imageUrl;
// 	semester.subjectId = req.body.subjectId;
// 	semester.status = "pending";
// 	if (!semester.imageId || !semester.imageUrl) {
// 		semester.imageId = subject.imageId;
// 		semester.imageUrl = subject.imageUrl;
// 	}
// 	[err, savedarticle] = await to(semester.save());
// 	if (err) {
// 		logger.error("Semester Controller - update : Semester count not be saved", err);
// 		return ReE(res, err, 422);
// 	}
// 	return ReS(res, { message: 'Updated Subject: ' + semester.name });
// }
// module.exports.update = update;

// const remove = async function (req, res) {
// 	let semester_id, err, semester;
// 	if (!req.query._id) {
// 		logger.error("Semester Controller - remove : Semester Id is not provided");
// 		return ReE(res, new Error("Semester Id is not provided"), 422);
// 	}
// 	semester_id = req.query._id;

// 	[err, semester] = await to(findByPk(semester_id));
// 	if (err) {
// 		logger.error("Semester Controller - remove : Semester not found", err);
// 		return ReE(res, err, 422);
// 	}
// 	if (!semester.userId || !semester.userId.equals(req.user.id)) {
// 		logger.error("Semester Controller - remove : User not authorized to remove this semester", err);
// 		return ReE(res, "User not authorized to remove this semester", 422);
// 	}
// 	[err, semester] = await to(semester.destroy());
// 	if (err) {
// 		logger.error("Semester Controller - remove : Semester could not be deleted", err);
// 		return ReE(res, err, 422);
// 	}
// 	return ReS(res, { message: 'Deleted semester' }, 204);
// }
// module.exports.remove = remove;

// const list = async function (req, res) {

// 	let articleList, articleCount;
// 	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
// 	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

// 	[err, articleList] = await to(Semester.find({ "status": "live" }).sort({ createdAt: -1 }).limit(limit).skip(offset));
// 	if (err) {
// 		logger.error("Semester Controller - list : Semesters not found", err);
// 		return ReE(res, err, 422);
// 	}
// 	[err, articleCount] = await to(Semester.find({ "status": "live" }).count());
// 	if (err) {
// 		logger.error("Semester Controller - list : Semester count not found", err);
// 		return ReE(res, err, 422);
// 	}
// 	res.setHeader('Content-Type', 'application/json');

// 	return ReS(res, { semester: JSON.stringify(articleList), total: articleCount });
// }

// module.exports.list = list;

// const mysemesters = async function (req, res) {
// 	let articleList, articleCount;

// 	if (!req.user.id) {
// 		logger.error("Semester Controller - create : User not logged in", err);
// 		return ReE(res, err, 401);
// 	}
// 	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
// 	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

// 	[err, articleList] = await to(Semester.find({ userId: req.user.id }).limit(limit).skip(offset));
// 	if (err) {
// 		logger.error("Semester Controller - mysemesters : Semesters not found", err);
// 		return ReE(res, err, 422);
// 	}

// 	[err, articleCount] = await to(Semester.find({ userId: req.user.id }).count());
// 	if (err) {
// 		logger.error("Semester Controller - mysemesters : Semesters count not found", err);
// 		return ReE(res, err, 422);
// 	}

// 	res.setHeader('Content-Type', 'application/json');

// 	return ReS(res, { semester: JSON.stringify(articleList), total: articleCount });
// }

// module.exports.mySemesters = mysemesters;