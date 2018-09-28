'use strict';

const friendList = require('../models/freindList');
var records = [];

exports.getFriendRequestsList = user_email => 
	
	new Promise((resolve,reject) => {

		friendList.find({user_email: user_email, request_status : 'UNAPPROVED' },{'user_email' : true, 'with_contact_email':true, 'time' : true })
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
