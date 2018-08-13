'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.storeNameStatus = (email, name, status) => 

	

	new Promise((resolve,reject) => {
		
		console.log(email +" "+ name +" " +status );
		user.find({ email: email})
	
		.then(users => {
				let user = users[0];
			
				user.name = name;
				user.status = status;
				return user.save();				
		})

		.then(user => resolve({ status: 200, message: 'FireBase Id  Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});
