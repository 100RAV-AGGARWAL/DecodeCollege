"use strict";
const mongoose = require('mongoose');

const Semester = mongoose.model('Semester', new mongoose.Schema({
	sem_no: { type: Number, allowNull: false, required: [true, 'Semester Number is required'] },
	sem_marks: [
		{
			subjectName:{type:String,required:[true,'Name is required']},
			subjectId: { type: mongoose.ObjectId, ref: 'Subject', required: [true, 'Subject is required'] },
			marks: { type: Number, required: [true, 'Marks is required'] },
			credit: { type: Number, }
		}
	],
	createdById: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	grade: { type: Number }
}, { timestamps: true }));
module.exports = Semester;
