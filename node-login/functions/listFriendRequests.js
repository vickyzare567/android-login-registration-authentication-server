'use strict';

const user = require('../models/user');
var records = [];

exports.getFriendRequestsList = user_email => 
	
	new Promise((resolve,reject) => {

		user.find({email: {$ne : email} },{'name' : true, 'email':true, 'mobile':true , status : true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
