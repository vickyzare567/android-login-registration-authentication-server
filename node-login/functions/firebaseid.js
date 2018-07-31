
'use strict';

const firebase = require('../models/firebase');
const bcrypt = require('bcryptjs');

exports.updatefirebaseId = (fid, did, email) => 

	new Promise((resolve,reject) => {


		const newFireid = new firebase({
			fid: fid,
			did: did,
			email: email
		});

		newFireid.save()

		.then(() => resolve({ status: 201, message: 'Fire Id Registered Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'Fire Id Already Registered !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});
