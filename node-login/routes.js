'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');


const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const fireid = require('./functions/firebaseid');
const allcontacts = require('./functions/allcontacts');
const namestatus = require('./functions/namestatus');

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
			
			if (!email || !name || !status || !email.trim() || !name.trim() || !status.trim() ) {

				res.status(400).json({message: 'Invalid Request !'});

			} else {

				namestatus.storenamestatus(email, name, status)

				.then(result => {

					res.setHeader('Location', '/storenamestatus/'+email);
					res.status(result.status).json({ message: result.message })
				})

				.catch(err => res.status(err.status).json({ message: err.message }));
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
