const { to, ReE, ReS } = require('../services/util.service');
const { File } = require('../models');
var formidable = require('formidable');
var fs = require('fs');
const logger = require("../lib/logging");

const upload = async function (req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) {
			return;
		}
	});
	form.on("file", async function (name, file) {
		var fileData = fs.readFileSync(file.path);
		var fileInstance = new File();
		fileInstance.name = file.name;
		fileInstance.fileData = fileData;
		fileInstance.fileExt = file.type;
		[err, fileInstance] = await to(fileInstance.save());
		if (err) {
			logger.error("File Controller - upload : File could not be uploaded", err);
			return ReE(res, err, 422);
		}
		return ReS(res, { message: 'Successfully uploaded new file.', file: fileInstance }, 201);
	})
}

module.exports.upload = upload;

const get = async function (req, res) {

	let file_id, err, file, user;
	file_id = req.query._id;

	[err, file] = await to(findByPk(file_id));
	if (err) {
		logger.error("File Controller - get : File could not be retreived", err);
		return ReE(res, err, 422);
	}
	if (!file.fileData) {
		logger.error("File Controller - get : File is corrupted", err);
		return ReE(res, new Error("File not readable"));
	}
	res.setHeader('Content-Type', 'application/json');
	res.writeHead(200, {
		'Content-Type': file.fileExt,
		'Content-Length': file.fileData.buffer.length
	});
	res.end(file.fileData.buffer);
}
module.exports.get = get;

const findByPk = async function (id) {
	let err, file;

	[err, file] = await to(File.findById(id));
	if (err || !file) {
		logger.error("File Controller - findByPk : File is unavailable", err);
		throw new Error("err finding file");
	}
	return file;
}