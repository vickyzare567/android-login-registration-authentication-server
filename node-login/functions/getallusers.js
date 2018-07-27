'use strict';

const user = require('../models/user');
var u;
exports.getProfile = email => 
var records;

new Promise((resolve,reject) => {

		 u= user.find({}, { name: true, email: true, mobile : true }).toArray(function(err, result) {
        			if (err) throw err;
           			 records=JSON.stringify(result);
			 console.log(records);
			});
		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
		console.log(u);

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


