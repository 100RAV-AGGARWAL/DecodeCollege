'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var basename = path.basename(__filename);
var db = {};
const config = require("config");

const mongooseIns = mongoose.connect(config.get("dbconfig").url, { useNewUrlParser: true, useUnifiedTopology: true });

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		var model = require(path.join(__dirname, file));
		db[model.modelName] = model;
	});

module.exports = db;