var mongoose = require('../mongoose');

var schemaAdmin = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true // унікальне значення
	},
	password: {
		type: String,
		require: true
	}

});

var Admin = mongoose.model('admin', schemaAdmin);

module.exports = Admin;