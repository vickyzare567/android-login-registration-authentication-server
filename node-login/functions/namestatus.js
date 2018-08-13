'use strict';

const user = require('../models/user');

exports.registerUser = (email, password, mobile, device_id, firebase_id) => 

	new Promise((resolve,reject) => {

  	    const salt = bcrypt.genSaltSync(10);
	    	const hash = bcrypt.hashSync(password, salt);

		    const newUser = new user({
		   	email: email,
			  mobile: mobile,
			  hashed_password: hash,
			  created_at: new Date(),
			  device_id : device_id,
			  firebase_id : firebase_id
		});

		newUser.save()

		.then(() => resolve({ status: 201, message: 'User Registered Sucessfully !' }))

		.catch(err => {

		  	if (err.code == 11000) {
						
			  	reject({ status: 409, message: 'User Already Registered !' });

			  } else {

				  reject({ status: 500, message: 'Internal Server Error !' });
			  }
		});
	});
