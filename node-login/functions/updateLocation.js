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
				user.loc = { type: "Point", coordinates: [ locationlong, locationlat ] };
				var id = user.save();	
				return id;
		})

		.then(user => {
			console.log(user);
			resolve({ status: 200, message: 'FireBase Id  Updated Sucessfully !' });
		})

		.catch(err => {
			console.log(err);
			reject({ status: 500, message: 'Internal Server Error !' });
		});

	});
