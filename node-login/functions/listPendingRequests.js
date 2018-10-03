
'use strict';

const friendList = require('../models/freindList');
var records = [];

exports.getPendingRequestsList = user_email => 
	
	new Promise((resolve,reject) => {

		friendList.find({user_email: user_email, request_status : 'UNAPPROVED' },{'with_contact_email' : true, 'user_email':true, 'time' : true , 'request_status':true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
