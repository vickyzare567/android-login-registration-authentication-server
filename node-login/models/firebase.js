'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const fireSchema = mongoose.Schema({ 

	fid 			: String,
	did			: String,
	email			: {type: String, unique: true}
	
});

fireSchema.plugin(AutoIncrement, {inc_field: 'fire_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('firebase', fireSchema);      
