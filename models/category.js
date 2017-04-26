var mongoose = require('../mongoose');

var schemaCategory = new mongoose.Schema({
	name: {
		type: String,
		require: true,
		unique: true // унікальне значення
	}
});

var Category = mongoose.model('category', schemaCategory);

module.exports = Category;