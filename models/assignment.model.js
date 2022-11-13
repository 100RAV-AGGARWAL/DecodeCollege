"use strict";
const mongoose = require('mongoose');

const Assignment = mongoose.model('Assignment', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Assignment Name is required'] },
	deadline: { type: Date, allowNull: true },
	filePath: { type: String, allowNull: false },
	status: {
		type: String,
		enum: ["PENDING", "SUBMITTED", "MISSED"],
		defaultValue: "PENDING",
	},
	fileId: { type: mongoose.ObjectId, ref: 'File', allowNull: true },
	createdById: { type: mongoose.ObjectId, ref: 'User', allowNull: true },
	subjectId: { type: mongoose.ObjectId, ref: 'Subject', allowNull: true },
}, { timestamps: true }));

module.exports = Assignment;