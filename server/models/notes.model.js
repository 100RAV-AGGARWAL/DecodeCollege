"use strict";
const mongoose = require('mongoose');

const Notes = mongoose.model('Notes', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Name is required'] },
	userId: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	fileId: { type: mongoose.ObjectId, ref: 'File', allowNull: true },
	filePath: { type: String, allowNull: false },
	subjectId: { type: mongoose.ObjectId, ref: 'Subject', allowNull: true },
	status: { type: String, enum: ['private', 'public'], default: "private" },
}, { timestamps: true }));

module.exports = Notes;