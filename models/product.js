var mongoose = require('../mongoose'); // вийшли з папки моделс і знаходимо в корні монгоос

var schemaProducts = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	model: {
		type: String,
		require: true
	},
	category: {
		type: String,
		require: true
	},
	count:  {
		type: Number,
		require: true
	},
	price:  {
		type: Number,
		require: true
	},
	path: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	}
});

var Products = mongoose.model('products', schemaProducts);

module.exports = Products;