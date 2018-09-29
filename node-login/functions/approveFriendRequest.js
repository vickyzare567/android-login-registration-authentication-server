'use strict';
const friendList = require('../models/freindList');


exports.approveRequest = (user_email,with_contact_email) => 
	
	new Promise((resolve,reject) => {

		friendList.find({user_email: user_email, request_status : 'UNAPPROVED',with_contact_email:with_contact_email})
	
		.then(records => {
				let friendList = records[0];
				friendList.request_status = 'APPROVED';
				var id = friendList.save();	
				return id;
		})
    
    .then(friendList => {
			resolve({ status: 200, message: 'Friend Request Approved Successfully !' });
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
