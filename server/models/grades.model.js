"use strict";
const mongoose = require('mongoose');

const Grades = mongoose.model('Grades', new mongoose.Schema({
	semester: { type: Number, allowNull: false, required: [true, 'Semester Number is required'] },
	marks: [{ type: Number, allowNull: false, required: [true, 'Marks are required'] }],
	createdById: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	subjectIds: [{ type: mongoose.ObjectId, ref: 'Subject', allowNull: false }],
}, { timestamps: true }));

module.exports = Grades;