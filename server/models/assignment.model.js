"use strict";
const mongoose = require('mongoose');

const Assignment = mongoose.model('Assignment', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Assignment Name is required'] },
	deadline: { type: Date, allowNull: true },
	fileName: { type: String, allowNull: false },
	fileSize: { type: Number, allowNull: false },
	filePath: { type: String, allowNull: false },
	status: {
		type: String,
		enum: ["PENDING", "SUBMITTED", "MISSED"],
		defaultValue: "PENDING",
	},
	createdById: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	subjectId: { type: mongoose.ObjectId, ref: 'Subject', allowNull: false },
}, { timestamps: true }));

module.exports = Assignment;