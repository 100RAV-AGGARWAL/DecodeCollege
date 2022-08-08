const { to, ReE, ReS } = require('../services/util.service');
const { File } = require('../models');
const logger = require("../lib/logging");
const multerUpload = require('../lib/multer');
const config = require('config');

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
				unlinkAsync(req.file.path);
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

	let err, file;
	[err, file] = await to(File.create({
		name: req.file.filename,
		filePath: req.file.path,
		itemType: itemType
	}));
	if (err) {
		logger.error("Upload Controller - upload : Could not create file ", err);
		return ReE(res, err, 422);
	}

	res.json({ status: 200, msg: "Successfully uploaded new" + itemType, file: file.toObject() });
}