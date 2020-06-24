import User from '../models/user';
import Crypto from 'crypto';
import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
	res.json({ message: 'Auth endpoint is live' });
});


router.post('/authenticate', (req, res) => {
	console.log(req.body);
	const { firstName, lastName, password } = req.body;
	if (!firstName || !lastName) {
		return res.json({
			success: false,
			message: 'Please enter a username and password',
		});
	} else {
		const newUser = new User({
			profile: {
				firstName: firstName,
				lastName: lastName,
			},
			password: Crypto.createHash('md5').update(password).digest('hex'),
		});

		newUser.save((err) => {
			if (err)
				return res.json({
					success: false,
					message: 'That email already already exists',
				});
			else
				return res.json({
					success: true,
					message: 'Successfully created the new user',
				});
		});
	}
});

router.post('/register', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	if (!firstName || !lastName) {
		return res.json({
			success: false,
			message: 'Please enter a username and password',
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

		newUser.save((err) => {
			if (err)
				return res.json({
					success: false,
					message: 'That email already already exists',
				});
			else
				return res.json({
					success: true,
					message: 'Successfully created the new user',
				});
		});
	}
});

export default router;
