const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	dealer: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	fileName: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
});

module.exports = dataSchema;
