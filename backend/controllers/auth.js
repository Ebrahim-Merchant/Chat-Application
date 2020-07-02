import User from '../models/user';
import Crypto from 'crypto';
import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
	res.json({ message: 'Auth endpoint is live' });
});


router.post('/authenticate', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: 'Please provide a email and password',
		});
	} else {
		User.findOne({email})
		.exec((err, user) => {
			if(err) {
				return res.status(500)
			} else {
				const hashedPass = Crypto.createHash('md5').update(password).digest('hex');
				if(user && user.password === hashedPass) {
					return res.status(200).json({ userId: user._id});
				} else {
					return res.status(401).json({ message: 'Username and password are incorrect'})
				}
			}
		})
	}
});

router.post('/register', (req, res) => {
	const { firstName,lastName, email, password } = req.body;
	if (!firstName || !lastName) {
		return res.status(400).json({
			message: 'Please provide a username and password',
		});
	} else {
		const newUser = new User({
			profile: {
				firstName: firstName,
				lastName: lastName,
			},
			email: email,
			password: Crypto.createHash('md5').update(password).digest('hex'),
		});

		newUser.save((err, user) => {
			if (err)
				return res.status(409).json({
					message: 'That email already already exists',
				});
			else
				return res.status(201).json({
					userId: user._id
				});
		});
	}
});

router.post('/reset/password', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: 'Please provide a email and password',
		});
	} else {
		User.findOneAndUpdate({email}, {password: Crypto.createHash('md5').update(password).digest('hex') })
		.exec((err, user) => {
			if(err) {
				return res.status(500)
			} else {
					return res.status(200).json({ userId: user._id});
			}
		})
	}
});




export default router;
