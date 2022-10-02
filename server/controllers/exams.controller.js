const { to, ReE, ReS } = require('../services/util.service');
const { Exams, Subject } = require('../models');
const logger = require("../lib/logging");


const create = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	let err, exams;
	const body = req.body;
	if (!req.body) {
		logger.error("Exams Controller - create : Request body is empty");
		return ReE(res, new Error("Request body is empty"), 422);
	}
	if (!req.body.subject._id) {
		logger.error("Exam Controller - create : Not able to read subject details");
		return ReE(res, err, 401);
	}
	if (!req.body.semester._id) {
		logger.error("Exam Controller - create : Not able to read subject details");
		return ReE(res, err, 401);
	}

	[err, exams] = await to(Exams.create(body));
	if (err) {
		logger.error("Exams Controller - create : Not able to save the exams ", err);
		return ReE(res, err, 422);
	}
	let examsJson = exams.toObject();
	examsJson.subjectId = [{ user: req.body.subject._id }];
	examsJson.semesterId = [{ user: req.body.semester._id }];
	return ReS(res, { message: 'Successfully created new Exams.', exams: examsJson }, 201);
}

module.exports.create = create;

const get = async function (req, res) {

	let err, exam, subject;
	if (!req.query._id) {
		logger.error("Exam Controller - get : Exam Id is empty");
		return ReE(res, err, 422);
	}
	console.log(req.query._id);
	[err, exams] = await to(findByPk(req.query._id));
	if (err) {
		logger.error("Exams Controller - get : Exams not found ", err);
		return ReE(res, err, 422);
	}
	// [err, subject] = await to(getSubjectInfo(exams.subject._id));
	// if (err) {
	// 	logger.error("exams Controller - get : exams User not found ", err);
	// 	return ReE(res, err, 422);
	// }
	// [err, semester] = await to(getSemesterInfo(exams.semester._id));
	// if (err) {
	// 	logger.error("exams Controller - get : exams User not found ", err);
	// 	return ReE(res, err, 422);
	// }
	let examsJson = exams.toObject()
	// examsJson.subjectId = subjectId;
	// examsJson.semesterId = semesterId;
	res.setHeader('Content-Type', 'application/json');
	console.log(examsJson);
	return ReS(res, { exams: examsJson });
}
module.exports.get = get;

const findByPk = async function (id) {
	let err, exams;
	if (!id) {
		logger.error("Exams Controller - findByPk : Exams Id is empty");
		throw new Error("exams Id is empty")
	}

	[err, exams] = await to(Exams.findById(id));
	if (err || !exams) {
		logger.error("Exams Controller - findByPk : Exams not found ", err);
		throw new Error("Exams not found");
	}
	return exams;
}
module.exports.findByPk = findByPk;

const list = async function (req, res) {
	console.log(req.body);
	let examsList, examsCount;
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	[err, examsList] = await to(Exams.find().sort().limit(limit).skip(offset));

	if (err) {
		logger.error("Exams Controller - list : Exams not found ", err);
		return ReE(res, err, 422);
	}

	[err, examsCount] = await to(Exams.find().count());

	if (err) {
		logger.error("Exams Controller - list : Exams count not found ", err);
		return ReE(res, err, 422);
	}
	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { exams: JSON.stringify(examsList), total: examsCount });
}

module.exports.list = list;

const examListByMonth = async function (req, res) {
	let examList;
	let month = Number(req.query.month);
	let year = Number(req.query.year);

	let startDate = new Date(`${year}-${month}-01`);
	let endDate = new Date(`${year}-${month + 1}-01`);

	[err, examList] = await to(
		Exams.find({
			userId: req.user.id, date: {
				$gte: startDate,
				$lt: endDate
			}
		})
	);
	if (err) return ReE(res, err.message);

	if (examList.length == 0) {
		return ReS(res, { exams: "[]" });
	}

	let examJson = examList.map(exam => {
		return exam.toObject();
	});

	res.setHeader("Content-Type", "application/json");

	return ReS(res, { exam: JSON.stringify(examJson), total: examJson.length });
};

module.exports.examListByMonth = examListByMonth;