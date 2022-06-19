"use strict";
const mongoose = require('mongoose');

const Subject = mongoose.model('Subject', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Name is required'] },
	semester: { type: String, allowNull: false, required: [true, 'Semester is required'] },
	credits: { type: Number, allowNull: false, required: [true, 'Credits are required'] },
	subjectcode: { type: String, allowNull: false, required: [true, 'Subject Code is required'] },
}));

module.exports = Subject;