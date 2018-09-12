'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const statusSchema = mongoose.Schema({ 

	from 			: String,
	status_text		: String,
	time			: String,
	image_location		: String,
	visible_to		: String,
	valid_till		: String
	
});

statusSchema.plugin(AutoIncrement, {inc_field: 'status_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('status', statusSchema);   
