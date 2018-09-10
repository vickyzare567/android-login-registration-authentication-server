'use strict';

const user = require('../models/user');
var records = [];

exports.getAllOnlineContacts = email => 
	
	new Promise((resolve,reject) => {

		user.find({email: {$ne : email}, online_status:'ONLINE' },{'name' : true, 'email':true, 'mobile':true , status : true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
