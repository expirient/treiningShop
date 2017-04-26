var mongoose = require('mongoose');
mongoose.connect('mongodb://expirient:honda72nofear@ds137220.mlab.com:37220/expirient');
console.log('mongoose connected success!');
module.exports = mongoose;