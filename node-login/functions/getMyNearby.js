'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getMyNearbyPeoples = (email, locationlat, locationlong) => 

	new Promise((resolve,reject) => {
	
		user.find({email: {$ne : email},  loc: { $geoWithin: { $centerSphere: [ [ locationlong, locationlat ], 5/3963.2 ] } } },{'name' : true, 'email':true, 'mobile':true , status : true, loc:true})
	
		.then(records => resolve(records))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
