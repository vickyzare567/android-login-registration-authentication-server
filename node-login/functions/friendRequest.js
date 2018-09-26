'use strict';

const friendList = require('../models/freindList');
var records = [];

exports.createFriendRequest =(user_email, with_contact_email) => 
	
	new Promise((resolve,reject) => {

		const  newFriend= new friendList({
			user_email: user_email,
			with_contact_email: with_contact_email,
			time: new Date(),
			request_status: 'UNAPPROVED'
		});

		newFriend.save()
		.then(() => resolve({ status: 201, message: 'Request Sent Successfully !' }))

		.catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'Already Freinds' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});

	});
