"use strict";
const mongoose = require('mongoose');

const Exams = mongoose.model('Exams', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Name is required'] },
	date: { type: Date, allowNull: false, required: [true, 'Date is required'] },	
	status: { type: String, enum: ['completed', 'pending', 'missed'], default: "pending" },
	subjectId: { type: mongoose.ObjectId, ref: 'Subject', allowNull: true },
	semesterId: {type : mongoose.ObjectId, ref: 'Semester', allowNull: true},
}));

module.exports = Exams;