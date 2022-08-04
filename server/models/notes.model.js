"use strict";
const mongoose = require('mongoose');

const Notes = mongoose.model('Notes', new mongoose.Schema({
	name: { type: String, allowNull: false, required: [true, 'Name is required'] },
	userId: { type: mongoose.ObjectId, ref: 'User', allowNull: false },
	status: { type: String, enum: ['private', 'public'], default: "private" },
}, { timestamps: true }));

module.exports = Notes;