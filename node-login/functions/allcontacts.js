
'use strict';

const user = require('../models/user');
var records[];

exports.getAllContacts = email => 
	
	new Promise((resolve,reject) => {

		user.find({},{'name' : true, 'email':true, 'mobile':true}).toArray(function(err, result) {
        	if (err) throw err;
            		records=result;
			console.log(records);
		})
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
