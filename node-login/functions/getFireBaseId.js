'use strict';

const fire = require('../models/firebase');

exports.getfirebaseid = email => 
	
	new Promise((resolve,reject) => {

		fire.find({ email: email }, { fid: 1, did: 1, email : 1})

		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
