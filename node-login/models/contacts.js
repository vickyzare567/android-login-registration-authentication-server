'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contactSchema = mongoose.Schema({ 

	contact_id 		: {type: String, unique: true},
	user_email		: String,
	contact_email		: String,
	user_mobile		: String,
	contact_mobile		: String,
	date		 	: String	
});

userSchema.plugin(AutoIncrement, {inc_field: 'contact_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('contacts', contactSchema); 
