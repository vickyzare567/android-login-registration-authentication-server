'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.storenamestatus = (email, name, status, locationlat, locationlong) => 

	

	new Promise((resolve,reject) => {
		
		console.log(email +" "+ name +" " +status );
		user.find({ email: email})
	
		.then(users => {
				let user = users[0];
			
				user.name = name;
				user.status = status;
				user.location = { type: "Point", coordinates: [ locationlong, locationlat ] };
				return user.save();				
		})

		.then(user => resolve({ status: 200, message: 'FireBase Id  Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});
