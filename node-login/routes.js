'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const validateotp = require('./functions/validateOtp');
const fireid = require('./functions/firebaseid');
const allcontacts = require('./functions/allcontacts');
const namestatus = require('./functions/namestatus');
const onlineContacts = require('./functions/onlineContacts');
const updateLocation = require('./functions/updateLocation');
const getMyNearby = require('./functions/getMyNearby');
const friendRequest = require('./functions/friendRequest');
const listFriendRequests = require('./functions/listFriendRequests');
const approveFriendRequest = require('./functions/approveFriendRequest');

const config = require('./config/config.json');




  
module.exports = router => {

	router.get('/', (req, res) => res.end('Welcome to Learn2Crack !'));

	router.post('/authenticate', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { });
			
				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users', (req, res) => {

		const email = req.body.email;
		const password = req.body.password;
		const mobile = req.body.mobile;
		const device_id = req.body.device_id;
		const firebase_id = req.body.firebase_id;
		if (!email || !password || !mobile || !device_id || !firebase_id || !email.trim() || !password.trim() || !mobile.trim() || !device_id.trim() || !firebase_id.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(email, password, mobile, device_id, firebase_id)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	
	router.post('/friendRequest/:id', (req, res) => {
		if(checkToken(req)) {
			const user_email = req.body.user_email;
			const with_contact_email = req.body.with_contact_email;
			if (!user_email || !with_contact_email || !user_email.trim() || !with_contact_email.trim() ) {
				res.status(400).json({message: 'Invalid Request !'});
			} else {

				friendRequest.createFriendRequest(user_email, with_contact_email)
				.then(result => {
					res.setHeader('Location', '/users/'+user_email);
					res.status(result.status).json({ message: result.message })
				})

				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		}else{
			res.status(401).json({message: 'Invalid Token !' });	
		}
		
	});
	
	router.post('/listFriendRequests/:id', (req, res) => {
		if(checkToken(req)) {
			const user_email = req.body.user_email;
			if (!user_email || !user_email.trim()) {
				res.status(400).json({message: 'Invalid Request !'});
			} else {

				listFriendRequests.getFriendRequestsList(user_email)
				.then(result => res.json(result))

				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		}else{
			res.status(401).json({message: 'Invalid Token !' });	
		}
		
	});
	
	router.post('/approveFriendRequest/:id', (req, res) => {
		if(checkToken(req)) {
			const user_email = req.body.user_email;
			const with_contact_email = req.body.with_contact_email;
			if (!user_email || !with_contact_email || !user_email.trim() || !with_contact_email.trim() ) {
				res.status(400).json({message: 'Invalid Request !'});
			} else {

				approveFriendRequest.approveRequest(user_email,with_contact_email)
				.then(result => {
					res.setHeader('FriendRequestStatus', '/users/'+user_email);
					res.status(result.status).json({ message: result.message })
				})
				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		}else{
			res.status(401).json({message: 'Invalid Token !' });	
		}
		
	});
	
	
	router.post('/updatefirebaseid', (req, res) => {

			const fid = req.body.firebase_id;
			const did = req.body.device_id;
			const email = req.body.email;
		
			if (!fid || !did || !email || !fid.trim() || !did.trim() || !email.trim() ) {

				res.status(400).json({message: 'Invalid Request !'});

			} else {

				fireid.updatefirebaseId(fid, did, email)

				.then(result => {

					res.setHeader('Location', '/fireid/'+email);
					res.status(result.status).json({ message: result.message })
				})

				.catch(err => res.status(err.status).json({ message: err.message }));
			}
	});
	
	router.post('/storenamestatus', (req, res) => {

			const email = req.body.email;
			const name = req.body.name;
			const status = req.body.status;
			const locationlat = req.body.locationlat;
			const locationlong = req.body.locationlong;
			if (!email || !name || !status || !locationlat || !locationlong || !email.trim() || !name.trim() || !status.trim() || !locationlat.trim() || !locationlong.trim()) {
				res.status(400).json({message: 'Invalid Request !'});

			} else {

				namestatus.storenamestatus(email, name, status, locationlat, locationlong)

				.then(result => {

					res.setHeader('Location', '/storenamestatus/'+email);
					res.status(result.status).json({ message: result.message })
				})

				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		
	});
	
	router.post('/updateLocation/:id', (req, res) => {

		if (checkToken(req)) {
			const email = req.body.email;
			const locationlat = req.body.locationlat;
			const locationlong = req.body.locationlong;
			if (!email  || !locationlat || !locationlong || !email.trim() || !locationlat.trim() || !locationlong.trim()) {
				res.status(400).json({message: 'Invalid Request !'});

			} else {

				updateLocation.updateUserLocation(email, locationlat, locationlong)
				
				.then(result => {

					res.setHeader('Location', '/storenamestatus/'+email);
					res.status(result.status).json({ message: result.message })
				})

				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		} else {
			res.status(401).json({ message: 'Invalid Token !' });
		}
		
	});

	
	router.post('/getMyNearby/:id', (req, res) => {

		if (checkToken(req)) {
			const email = req.body.email;
			const locationlat = req.body.locationlat;
			const locationlong = req.body.locationlong;
			if (!email  || !locationlat || !locationlong || !email.trim() || !locationlat.trim() || !locationlong.trim()) {
				res.status(400).json({message: 'Invalid Request !'});

			} else {
				getMyNearby.getMyNearbyPeoples(email, locationlat, locationlong)
				
				.then(result => res.json(result))
				.catch(err => res.status(err.status).json({ message: err.message }));
			}
		} else {
			res.status(401).json({ message: 'Invalid Token !' });
		}
		
	});
	
	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});
	
	router.get('/users/allcontacts/:id', (req,res) => {
		
		if(checkToken(req)) {
			
			allcontacts.getAllContacts(req.params.id)
			.then(result => res.json(result))
			.catch(err => res.status(err.status).json({messae : err.message}));
		}else{
			res.status(401).json({message: 'Invalid Token !' });	
		}
	});
	
	router.get('/users/allonlinecontacts/:id', (req,res) => {
		
		if(checkToken(req)) {
			onlineContacts.getAllOnlineContacts(req.params.id)
			.then(result => res.json(result))
			.catch(err => res.status(err.status).json({messae : err.message}));
		}else{
			res.status(401).json({message: 'Invalid Token !' });	
		}
	});
	
	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users/:id/otp', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;

		if (!token  || !token.trim() ) {

			validateotp.initOtp(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			validateotp.finishOtp(email, token)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
	
	
	router.post('/users/upload', (req, res) => {
		
   		 upload(req, res, function (err) {
	
     		   if (err) {

       		     res.status(400).json({message: err.message})
	
     		   } else {
      		      	let path = `/images/${req.file.filename}`
			console.log(req.body.filename);
         		res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
       		 }
    		})
	})
	

	
	router.get('/images/:imagename', (req, res) => {

   		 let imagename = req.params.imagename
   		 let imagepath = __dirname + "/images/" + imagename
   		 let image = fs.readFileSync(imagepath)
   		 let mime = fileType(image).mime

		res.writeHead(200, {'Content-Type': mime })
		res.end(image, 'binary')
	})
	
	
	  var storage = multer.diskStorage({
	    destination: function (req, file, cb) {
		console.log('Inside destination..');
	      cb(null, 'images/')
	    },
	    filename: function (req, file, cb) {
	      console.log(file);
	      var fileObj = {
		"image/png": ".png",
		"image/jpeg": ".jpeg",
		"image/jpg": ".jpg"
	      };
	      if (fileObj[file.mimetype] == undefined) {
		cb(new Error("file format not valid"));
	      } else {
		cb(null, req.body.filename+ fileObj[file.mimetype]);
	      }
	    }
	  })
	
	  const upload = multer({storage: storage }).single('image')

	
	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}
	

}
