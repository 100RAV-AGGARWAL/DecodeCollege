const { to, ReE, ReS } = require('../services/util.service');
const { File } = require('../models');
const logger = require("../lib/logging");

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

exports.uploadFile = async function (req, res) {
	if (req.query.itemType == "assignment") {
		uploadOnMulter(req, res, "assignment");
	} else {
		uploadOnMulter(req, res, "notes");
	}
}

const removePrevious = async function (fileId) {
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

const uploadOnMulter = async function (req, res, itemType) {
	if (!req.file) {
		return ReE(res, "No file uploaded");
	}
	let err;
	if (req.query.fileId && req.query.fileId != "") {
		[err, fileIns] = await to(removePrevious(req.query.fileId));
		if (err) {
			return ReE(res, err);
		}
	}

	let file;
	[err, file] = await to(File.create({
		name: req.file.filename,
		filePath: req.file.path,
		itemType: itemType
	}));
	if (err) {
		logger.error("Upload Controller - upload : Could not create file ", err);
		return ReE(res, err, 422);
	}

	return ReS(res, { message: "Successfully uploaded new" + itemType, file: file.toObject() }, 200);
}