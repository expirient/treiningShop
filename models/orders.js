var mongoose = require('../mongoose');

var schemaOrder = new mongoose.Schema({
	date: {
		type: String,
		require: true
	},
	client: {
		type: String,
		require: true
	},
	phone: {
		type: Number,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	order: {
		type: Array,
		require: true
	},

});

var Order = mongoose.model('order', schemaOrder);

module.exports = Order;