const { to, ReE, ReS } = require("../services/util.service");
const { Notes, User, File } = require("../models");
const { findSubjectById } = require("./subject.controller");
const { getPublicInfo } = require('./user.controller');
const { getSubjectInfo } = require("./subject.controller");
const UploadController = require('../controllers/upload.controller');
const logger = require("../lib/logging");

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
	if (!req.body.name) {
		logger.error("Notes name is required");
		return ReE(res, "Notes name is required");
	}
	if (!req.body.status) {
		logger.error("Notes status is required");
		return ReE(res, "Notes status is required");

	}
	if (!req.body.fileId) {
		logger.error("Notes fileId is required");
		return ReE(res, "Notes fileId is required");

	}
	if (!req.body.filePath) {
		logger.error("Notes filePath is required");
		return ReE(res, "Notes filePath is required");

	}


	note.set(req.body);
	note.subjectId = req.body.subject._id;

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
	let note_id, err, note, file_id;
	note_id = req.query.noteId;
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

	[err, note] = await to(Notes.deleteOne({ _id: note_id }));
	if (err) {
		logger.error("Error deleting notes");
		return ReE(res, err);
	}
	if (err) return ReE(res, 'error occured trying to delete note');

	return ReS(res, { message: 'Deleted note' }, 204);
}
module.exports.remove = remove;

