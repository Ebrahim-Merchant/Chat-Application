import { sendResetEmail } from './../services/email';
import {
	createUser,
	getUserByEmail,
	getUserByEmailAndUpdate,
	getUserByToken,
	updateUser,
} from './../services/users';
import { getHashedPassword, generateToken } from './../services/utils';
import { Router, Request, Response } from 'express';

interface IAuthRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Auth endpoint is live' });
});

router.post('/authenticate', (req: IAuthRequest, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: 'Please provide a email and password',
		});
	}
	getUserByEmail(email).then((user) => {
		const hashedPass = getHashedPassword(password);
		if (user && user.password === hashedPass) {
			const { firstName, lastName } = user.profile;
			return res.status(200).json({ firstName, lastName, id: user._id });
		} else {
			return res
				.status(401)
				.json({ message: 'Username and password are incorrect' });
		}
	});
});

router.post('/register', (req: Request, res: Response) => {
	const { firstName, lastName, email, password } = req.body;
	if (!firstName || !lastName) {
		return res.status(400).json({
			message: 'Please provide a username and password',
		});
	}
	getUserByEmail(email)
		.then((user) => {
			if (!user) {
				createUser(firstName, lastName, email, password)
					.then((newUser) => res.json({ newUser }))
			} else {
				res.status(409).json({ message: "User already exists" })
			}
		})
});

router.post('/forgot/password', async (req: Request, res: Response) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ message: 'Email is missing' });
	}

	const resetPasswordToken = await generateToken();
	const resetPasswordExpires = new Date();
	resetPasswordExpires.setDate(resetPasswordExpires.getDate() + 1);
	getUserByEmailAndUpdate(email, {
		resetPasswordToken,
		resetPasswordExpires,
	}).then((user) => {
		if (!user?.email && !user?.profile) {
			return;
		}

		sendResetEmail(user?.email, user?.profile, `reset/${resetPasswordToken}`);
	});
});

router.post('/reset/:resetToken', (req, res) => {
	const { token, newPassword } = req.body;
	if (!token || !newPassword) {
		return res.status(400).json({
			message: 'Please provide a email and password',
		});
	}
	getUserByToken(token)
		.then((user) => {
			if (
				user?.resetPasswordExpires &&
				user?.resetPasswordExpires < new Date()
			) {
				return updateUser(
					{ email: user?.email },
					{ password: getHashedPassword(newPassword) }
				);
			}
		})
		.then(() => res.json({ message: 'Password Updated' }))
		.catch((error) => res.status(500).json(error));
});

export default router;
