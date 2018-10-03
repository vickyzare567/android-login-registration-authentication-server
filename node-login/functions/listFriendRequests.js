'use strict';

const friendList = require('../models/freindList');
var records = [];

exports.getFriendRequestsList = with_contact_email => 
	
	new Promise((resolve,reject) => {

		friendList.find({with_contact_email: with_contact_email, request_status : 'UNAPPROVED' },{'user_email' : true, 'user_email':true, 'time' : true , 'request_status':true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
