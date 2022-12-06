const { to, ReE, ReS } = require('../services/util.service');
const { File } = require('../models');
const logger = require("../lib/logging");

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const uploadFile = async function (req, res) {
	if (req.query.itemType == "assignment") {
		uploadOnMulter(req, res, "assignment");
	} else {
		uploadOnMulter(req, res, "notes");
	}
}
module.exports.uploadFile = uploadFile;

// exports.deleteFile = async function (fileId) {
// 	let fileId = req.body.fileId;
// 	if (!fileId) {
// 		return ReE(res, "File Id is required");
// 	}

// 	let userId = fileId.split("-")[0];
// 	if (userId != req.user._id) {
// 		return ReE(res, "You are not authorized to delete this file");
// 	}

// 	let err, fileIns;
// 	[err, fileIns] = await to(removePrevious(req.body.fileId));
// 	if (err) {
// 		return ReE(res, err);
// 	}
// 	return ReS(res, { message: "Successfully deleted file" }, 200);
// }

const removeFile = async function (fileId) {
	let err, file;
	if (fileId) {
		[err, file] = await to(File.findById(fileId))
		if (err) {
			logger.error("Upload Controller - upload : Could not find file for id ", fileId);
		} else {
			try {
				let path = file.filePath;
				[err, fileTemp] = await to(File.deleteOne({ _id: fileId }))
				if (err) {
					logger.error("Upload Controller - upload : Could not delete file for id ", fileId);
					return ReE(res, err);
				}
				[err, removeIns] = await to(unlinkAsync(path));
				if (err) {
					logger.error("Upload Controller - upload : Could not delete file for id ", fileId);
					return ReE(res, err);
				}
			} catch (err) {
				logger.error("Upload Controller - upload : Could not delete file for id ", fileId, err);
			}
		}
	}
}
module.exports.removeFile = removeFile;

const uploadOnMulter = async function (req, res, itemType) {
	if (!req.file) {
		return ReE(res, "No file uploaded");
	}

	let err;
	if (req.query.fileId && req.query.fileId != "") {
		[err, fileIns] = await to(removeFile(req.query.fileId));
		if (err) {
			return ReE(res, err);
		}
	}

	let file;
	[err, file] = await to(File.create({
		name: req.file.fileName,
		driveFileId: req.file.fileId,
		itemType: itemType
	}));
	// [err, file] = await to(File.create({
	// 	name: req.file.filename,
	// 	filePath: req.file.path,
	// 	itemType: itemType
	// }));
	if (err) {
		logger.error("Upload Controller - upload : Could not create file ", err);
		return ReE(res, err, 422);
	}

	return ReS(res, { message: "Successfully uploaded new" + itemType, file: file.toObject() }, 200);
}

