
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const friendslistSchema = mongoose.Schema({ 

	  user_email 	        : String,
	  with_contact_email    : String,	
	  time                  : String,
	  request_status	: String,
	  
    
});

friendslistSchema.plugin(AutoIncrement, {inc_field: 'friends_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('friendslist', friendslistSchema); 
