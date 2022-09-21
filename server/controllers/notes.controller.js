const { to, ReE, ReS } = require("../services/util.service");
const { Notes, User } = require("../models");
const { findSubjectById } = require("./subject.controller");
const { getPublicInfo } = require('./user.controller');
const { getSubjectInfo } = require("./subject.controller");

const create = async function (req, res) {
	res.setHeader("Content-Type", "application/json");
	const body = req.body;
	if (!req.user) {
		logger.error("No user found");
		return ReE(res, "No user found");
	}
	let err, notes, subject;
	notes = new Notes();
	if (!body.name) {
		logger.error("Note name is required");
		return ReE(res, "Note name is required");
	}
	notes.name = body.name;
	if (!body.subject._id) {
		logger.error("Note subject is required");
		return ReE(res, "Note subject is required");
	}
	notes.subjectId = body.subject._id;
	if (!body.fileId) {
		logger.error("Note File is required");
		return ReE(res, "Note File is required");
	}
	notes.fileId = body.fileId;
	if (!body.status) {
		logger.error("Note Status is required");
		return ReE(res, "Note Status is required");
	}
	notes.status = body.status;
	if (!body.filePath) {
		logger.error("Note FilePath is required");
		return ReE(res, "Note FilePath is required");
	}
	notes.filePath = body.filePath;
	notes.userId = req.user._id;
	[err, notes] = await to(notes.save());
	if (err) {
		return ReE(res, err, 422);
	}
	let notesJson = notes.toObject();
	return ReS(
		res,
		{ message: "Successfully created new notes.", notes: notesJson },
		201
	);
};
module.exports.create = create;
const list = async function (req, res) {

	let notesList, noteCount, err;
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
	[err, notesList] = await to(Notes.find({ userId: req.user.id }).sort(order).limit(limit).skip(offset));
	if (err) {
		logger.error("Notes Controller - list : Notes could not be fetched", err);
		return ReE(res, err, 422);
	}

	let notesJson = notesList.map(notes => {
		return notes.toObject();
	});
	for (let index in notesJson) {
		[err, subject] = await to(getSubjectInfo(notesJson[index].subjectId));
		if (err) return ReE(res, err.message);

		notesJson[index].subject = {
			_id: subject._id,
			name: subject.name,
			subjectcode: subject.subjectcode,
			credits: subject.credits,
			semester: subject.semester,
		};
	}
	[err, noteCount] = await to(Notes.find().count());
	if (err) {
		logger.error("Notes Controller - list : Note count could not be fetched", err);
		return ReE(res, err, 422);
	}

	res.setHeader('Content-Type', 'application/json');
	return ReS(res, { notes: JSON.stringify(notesJson), count: noteCount });
}
module.exports.list = list;
const findByPk = async function (id) {
	let note_id, err, note;
	note_id = id;

	[err, note] = await to(Notes.findById(note_id));

	if (err) throw new Error("err finding notes");
	if (!note) throw new Error("Notes not found with id: " + note_id);

	return note;
};
module.exports.findAssignmentById = findByPk;

const get = async function (req, res) {
	let note_id, err, note, user;
	note_id = req.query._id;

	[err, note] = await to(findByPk(note_id));
	if (note_id)
		if (err) return ReE(res, err.message);
	if (note.status == 'private') {
		if (note.userId != req.user.id) {
			return ReE(res, "Sorry,User is not authorized to view it.");
		}
	}

	[err, user] = await to(getPublicInfo(note.userId));
	[err, subject] = await to(getSubjectInfo(note.subjectId));

	let noteJson = note.toObject();

	noteJson.user = user;
	noteJson.subject = subject;
	res.setHeader("Content-Type", "application/json");
	[err, savednote] = await to(note.save());
	if (err) {
		throw err;
	}
	return ReS(res, { note: noteJson });
};
module.exports.get = get;
const update = async function (req, res) {
	let note_id, err, note, savednote;
	note_id = req.body._id;

	[err, note] = await to(findByPk(note_id));
	if (err) return ReE(res, err.message);


	note.set(req.body);

	[err, savednote] = await to(note.save());
	if (err) {
		if (err.message == "Validation error")
			err = "The note is already in use";
		return ReE(res, err);
	}
	return ReS(res, { message: "Updated Note: " + note.subjectId });
};
module.exports.update = update;

const remove = async function (req, res) {
	let note_id, err, note;
	note_id = req.query._id;

	[err, note] = await to(findByPk(note_id));
	if (err) return ReE(res, err.message);

	[err, note] = await to(note.destroy());
	if (err) return ReE(res, 'error occured trying to delete note');

	return ReS(res, { message: 'Deleted note' }, 204);
}
module.exports.remove = remove;

