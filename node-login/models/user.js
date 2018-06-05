'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema({ 

	name 			: String,
	email			: {type: String, unique: true}, 
	mobile			: String,
	hashed_password 	: String,
	created_at		: String,
	temp_password   	: String,
	temp_password_time      : String
	
});

userSchema.plugin(AutoIncrement, {inc_field: 'user_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('user', userSchema);        
