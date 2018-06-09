'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const messageSchema = mongoose.Schema({ 

	from 			: String,
	to			: String,
	time			: String,
	status		 	: String,
	delivered_time		: String	
});

userSchema.plugin(AutoIncrement, {inc_field: 'user_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('messages', userSchema); 
