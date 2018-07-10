'use strict';

const user = require('../models/user');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var res;
exports.getProfile = email => 
	
	new Promise((resolve,reject) => {

		MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("node-login");
		res= dbo.collection("users").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		db.close();
		});
    });
		
    .then(users => resolve(res))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
