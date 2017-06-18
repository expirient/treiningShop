var mongoose = require('../mongoose'); // вийшли з папки моделс і знаходимо в корні монгоос

var schemaPeoples = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	login: {
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
	password: {
		type: String,
		require: true
	},
	orders: {
		type: Array
	},
	messages:{
		type:Array
	}
});

var Peoples = mongoose.model('peoples', schemaPeoples);

module.exports = Peoples;