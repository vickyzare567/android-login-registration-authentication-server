'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getMyNearbyPeoples = (email, locationlat, locationlong) => 

	new Promise((resolve,reject) => {
	
		user.find({email: {$ne : email},  loc: { $geoWithin: { $centerSphere: [ [ 73.7188, 18.5971], 5/3963.2 ] } } },{'name' : true, 'email':true, 'mobile':true , status : true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
