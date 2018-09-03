'use strict';
const messageModel = require('../models/message');

exports.save = (from_email, to_email, message ) => 

	new Promise((resolve,reject) => {
		const newMessage = new messageModel({
			from_email : from_email,
			to_email   : to_email,
			message    : message,
			time	   : new Date(),
			has_image  : 'NONE',
			image_url  : 'NONE',
			isreaded   : 'FALSE',
			isdelivered: 'FALSE'
		});

		newMessage.save()

		.then(() => resolve({ status: 201, message: 'Message Stored Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'Message Already Stored !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});

