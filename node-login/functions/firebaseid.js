
'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.updatefirebaseId = (fid, did, email) => 

	

	new Promise((resolve,reject) => {
		
		console.log(fid +" "+ did +" " +email );
		user.find({  email: email})
	
		.then(users => {
				
				user.firebase_id = fid;
				user.device_id = did;
				return user.save();				
		})

		.then(user => resolve({ status: 200, message: 'FireBase Id  Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});
