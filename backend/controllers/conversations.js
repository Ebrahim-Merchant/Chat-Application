import Conversation from '../models/converstation';
import Message from '../models/message';
import express from 'express';
import { ConversationsService } from '../services/conversations';

const router = express.Router();
const conversationService = new ConversationsService();
console.log(conversationService);

router.get('/', (_req, res) => {
	res.json({ message: 'Conversataion endpoint is live' });
});

router.get('/conversations/:userId', (req, res, next) => {
	const { userId } = req.params;
	conversationService.getAllConversation(res, next, userId);
});

router.get('/:conversationId', (req, res) => {
	const { conversationId} = req.params;
	Message.find({ conversationId: conversationId })
		.select('createdAt body author')
		.sort('createdAt')
		.populate({
			path: 'author',
			select: 'profile.firstName profile.lastName',
		})
		.exec(function (err, messages) {
			if (err) return res.json({ sucess: false, error: err });
			else res.json({ success: true, conversation: messages });
		});
});

router.post('/new', (req, res) => {
	const { recipentId, composedMessage, userId } = req.body;
	console.log(recipentId + ', ' + composedMessage + ', ' + userId);
	if (!recipentId) {
		return res.json({ success: false, error: 'Please add a recipents' });
	}
	if (!composedMessage) {
		return res.json({ sucess: false, error: 'Please enter a message' });
	}
	const conversation = new Conversation({
		participants: [userId, recipentId],
	});
	console.log(conversation);

	conversation.save((err, newConversation) => {
		if (err) return res.json({ success: false, error: err._message });
		const message = new Message({
			conversationId: newConversation._id,
			body: composedMessage,
			author: userId,
		});

		message.save((err, _newMessage) => {
			if (err) return res.json({ success: false, error: err });
			else res.json({ success: true, message: 'Conversation started!' });
		});
	});
});

router.post('', (req, res) => {
	const reply = new Message();
	const { conversationId, body, author } = req.body;
	if (!conversationId || !body || !author) {
		return res.json({
			success: false,
			error: 'You must provide an converstaionId and message',
		});
	}
	reply.conversationId = conversationId;
	reply.body = body;
	reply.author = author;
	console.log(reply);
	reply.save((err) => {
		if (err) return res.status(500).json({ success: false, error: err });
		return res.json({ success: true });
	});
});

export default router;
