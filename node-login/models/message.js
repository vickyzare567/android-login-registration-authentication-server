
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const messageSchema = mongoose.Schema({ 

	from_email 			: String,
	to_email        : String,
  time            : String,
  message         : String,
  has_image       : String,
  image_url       : String,
  isreaded        : String,
  isdelivered     : String
});

userSchema.plugin(AutoIncrement, {inc_field: 'message_id', disable_hooks: true});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-login');

module.exports = mongoose.model('message', messageSchema); 
