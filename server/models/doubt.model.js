"use strict";
const mongoose = require('mongoose');

const Doubt = mongoose.model('Doubt', new mongoose.Schema({
	description: { type: String, allowNull: false, required: [true, 'Topic is required'] },
	solvedOn: { type: Date, allowNull: true },
	topic: { type: String, enum: ['customer-support', 'academic-support'], default: "customer-support" },
	status: { type: String, enum: ['solved', 'unsolved'], default: "unsolved" },
	raisedBy: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	solvedBy: { type: mongoose.ObjectId, ref: 'User', allowNull: true },
}, { timestamps: true }));

module.exports = Doubt;