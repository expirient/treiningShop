var mongoose = require('../mongoose'); // вийшли з папки моделс і знаходимо в корні монгоос

var schemaFacebookPeoples = new mongoose.Schema({
	id: {
		type: String,
		require: true,
		unique: true
	},
	name: {
		type: String,
		require: true
	},
	login: {
		type: String,
		require: true,
		unique: true
	},
	phone: {
		type: Number,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	token: {
		type: String,
		require: true,
	},
	photos:{
		type: String,
		require: true
	},
	orders:{
		type: Array
	},
	messages:{
		type:Array
	}
});

var FacebookUsers = mongoose.model('facebookPeoples', schemaFacebookPeoples);

module.exports = FacebookUsers;