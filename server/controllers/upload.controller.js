const { to, ReE, ReS } = require('../services/util.service');
const { File } = require('../models');
const logger = require("../lib/logging");
const multerUpload = require('../lib/multer');
const config = require('config');

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

exports.uploadAssignmentFile = async function (req, res) {
	uploadOnMulter(req, res, "assignment");
}

exports.uploadNotesFile = async function (req, res) {
	uploadOnMulter(req, res, "notes");
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
	let uploadContent = multerUpload.single(itemType);
	let fileError = "File specifications allowed : Size - " + config.get('fileUploadConfig').size + "Kb, File Type - " + config.get('fileUploadConfig').extensionType;
	uploadContent(req, res, async function (err) {
		if (err) {
			return ReE(res, fileError, 422);
		} else {
			let fileInstance = {};
			let file;
			fileInstance.filePath = req.file.location;
			fileInstance.itemType = itemType;
			[err, file] = await to(File.create(fileInstance));

			removePrevious(req.body.fileId);
			res.json({ status: 200, msg: "Successfully uploaded new file.", file: file.toObject() });
		}
	});
}