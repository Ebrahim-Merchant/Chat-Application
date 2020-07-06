import User from '../models/user';
import express, { response } from 'express';
import { ConversationsService } from '../services/conversations';

const router = express.Router();
const conversationService = new ConversationsService();


router.get('/', (_req, res) => {
	res.json({ message: 'Users endpoint is live' });
});

/** 
 * Removing users
*/
router.delete('/:userId', (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.json({ success: false, error: 'Please Enter a User ID' });
	} else if (userId == 'all') {
		User.remove({}, (err) => {
			if (err)
				return res.json({
					success: false,
					error: 'Unable to delete all users',
				});
			else return res.json({ success: true, message: 'Deleted All Users' });
		});
	} else {
		User.findByIdAndRemove(userId, (err, data) => {
			if (err)
				return res.json({
					success: false,
					error: 'Unable to the users',
				});
			else return res.json({ success: true, message: 'Deleted the user' });
		})
	}
});

router.get('/all/:userId', (req, res) => {
	const { userId } = req.params;
	User.find({_id: {$ne: userId}}, (err, users) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: users });
	});
});

router.get('/:userId', (req, res) => {
	const { userId } = req.params;
	User.findById({ _id: userId })
	.select('-password')
	.exec(function (err, users) {
		if (err) return res.json({ success: false, error: err });
		if(users) { users.toJSON()}
		return res.json({ success: true, userProfile: users });
	});
});

router.get('/conversations/:userId', (request, response, next) => {
	const { userId } = request.params;
	conversationService.getConversations(response, next, userId);
})

export default router;
