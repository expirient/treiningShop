var mongoose = require('./mongoose');

var schemaProducts = new mongoose.Schema({
	name: String,
	model: String,
	category: String,
	count: Number,
	price: Number,
	path: String,
	description: String
});

var Products = mongoose.model('products', schemaProducts);

module.exports = Products;