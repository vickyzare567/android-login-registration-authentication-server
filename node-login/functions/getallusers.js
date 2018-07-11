'use strict';

const user = require('../models/user');

exports.getProfile = email => 
	
new Promise((resolve,reject) => {

		user.find({})
		
	
		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	console.log(user);

	});	





/* new Promise((resolve,reject) => {

		MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("node-login");
		res= dbo.collection("users").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		db.close();
		});
			
		.then(users => resolve(res))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
    });
		
    

	});
*/


