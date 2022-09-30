const { to, ReE, ReS, TE } = require("../services/util.service");
const { Subject } = require("../models");
const logger = require("../lib/logging");

const create = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	const body = req.body;

	if (!body.name) {
		logger.error("Subject Controller - create : Subject Name cannot be empty");
		return ReE(res, new Error('Please enter a valid Subject Name.'), 422);
	} else if (!body.subjectcode) {
		logger.error("Subject Controller - create : Subject Code cannot be empty");
		return ReE(res, new Error('Please enter a valid Subject Code.'), 422);
	} else {
		let err, subject;


		[err, subject] = await to(Subject.create(body));
		if (err) {
			logger.error("Subject Controller - create : Subject could not be saved", err);
			return ReE(res, err, 422);
		}

		return ReS(res, { message: 'Successfully created new subject.', subject: subject.toObject() }, 201);
	}
}
module.exports.create = create;

const list = async function (req, res) {

	let subjectList, subjectCount, err;
	var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	var search = {};
	var order = [];
	if (req.query.search) {
		search = req.query.search;
		search = JSON.parse(search)
	}
	if (req.query.order) {
		order = req.query.order;
		order = JSON.parse(order);
	}
	[err, subjectList] = await to(Subject.find().sort(order).limit(limit).skip(offset));
	if (err) {
		logger.error("Subject Controller - list : Subject could not be fetched", err);
		return ReE(res, err, 422);
	}
	[err, subjectCount] = await to(Subject.find().count());
	if (err) {
		logger.error("Subject Controller - list : Subject count could not be fetched", err);
		return ReE(res, err, 422);
	}

	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { subject: JSON.stringify(subjectList), count: subjectCount });
}

module.exports.list = list;

const get = async function (req, res) {

	let subject_id, err, subject;
	if (!req.query._id) {
		logger.error("Subject Controller - get : Subject Id is empty");
		return ReE(res, new Error('Subject Id is empty.'), 422);
	}
	subject_id = req.query._id;

	[err, subject] = await to(findByPk(subject_id));
	if (err) {
		logger.error("Subject Controller - get : Subject not found", err);
		return ReE(res, err, 422);
	}

	res.setHeader('Content-Type', 'application/json');

	return ReS(res, { feature: subject.toObject() });
}
module.exports.get = get;
const getBySem=async function(req,res){
	let subjectList, subjectCount,sem_no, err;
	// var limit = req.query.limit ? (req.query.limit < 20 && req.query.limit > 0) ? parseInt(req.query.limit) : 20 : 20;
	// var offset = req.query.offset ? req.query.offset > 0 ? parseInt(req.query.offset) : 0 : 0;

	var search = {};
	var order = [];
	if (req.query.search) {
		search = req.query.search;
		search = JSON.parse(search)
	}
	console.log(req.body.sem);
	if (req.query.order) {
		order = req.query.order;
		order = JSON.parse(order);
	}
	if (!req.body.sem) {
		logger.error("Subject Controller - getBySem : Semester number is empty");
		return ReE(res, new Error('Semester number is empty.'), 422);
	}
	sem_no= req.body.sem;
	[err, subjectList] = await to(Subject.find({semester:sem_no}).sort(order));
	if (err) {
		logger.error("Subject Controller - getBySem : Subjects not found", err);
		return ReE(res, err, 422);
	}
	[err, subjectCount] = await to(Subject.find({semester:sem_no}).count());
	if (err) {
		logger.error("Subject Controller - getBySem : Subject count could not be fetched", err);
		return ReE(res, err, 422);
	}

	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { subject: JSON.stringify(subjectList), count: subjectCount });
}
module.exports.getBySem = getBySem;

const findByPk = async function (id) {
	let subject_id, err, subject;
	subject_id = id;

	[err, subject] = await to(Subject.findById(subject_id));
	if (err || !subject) {
		logger.error("Subject Controller - findbypk : Subject not found", err);
		throw new Error("Subject not found");
	}
	return subject;
}
module.exports.findSubjectById = findByPk;

const update = async function (req, res) {
	let subject_id, err, subject, savedsubject;
	if (!req.body._id) {
		logger.error("Subject Controller - update : Subject Id is empty");
		return ReE(res, new Error('Subject Id is empty.'), 422);
	}
	subject_id = req.body._id;

	[err, subject] = await to(findByPk(subject_id));
	if (err) {
		logger.error("Subject Controller - update : Subject not found", err);
		return ReE(res, err, 422);
	}
	subject.name = req.body.name;

	[err, savedsubject] = await to(subject.save());
	if (err) {
		logger.error("Subject Controller - update : Subject could not be updated", err);
		return ReE(res, err, 422);
	}
	return ReS(res, { message: 'Updated Feature: ' + subject.name });
}
module.exports.update = update;


const getSubjectInfo = async function (subjectId) {
	let err, subject;
	[err, subject] = await to(Subject.findById(subjectId));
	if (err && !subject) {
		logger.error("Subject Controller - getSubjectInfo : Unable to find the subject", err);
		throw err;
	}
	return {
		id: subject._id,
		_id: subject._id,
		name: subject.name,
		subjectcode: subject.subjectcode,
		semester: subject.semester,
		credits: subject.credits,
	}

}
module.exports.getSubjectInfo = getSubjectInfo;