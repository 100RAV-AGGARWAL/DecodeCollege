"use strict";
const mongoose = require('mongoose');

const Doubt = mongoose.model('Doubt', new mongoose.Schema({
	description: { type: String, allowNull: false, required: [true, 'Topic is required'] },
	topic: { type: String, enum: ['customer-support', 'academic-support'], default: "customer-support" },
	status: { type: String, enum: ['solved', 'accepted', 'unsolved'], default: "unsolved" },
	raisedBy: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	assignedTo: { type: mongoose.ObjectId, ref: 'User' },
}, { timestamps: true }));

module.exports = Doubt;