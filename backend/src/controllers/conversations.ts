import { createMessage } from './../services/message';
import {
	getConversations,
	createConversation,
} from './../services/conversation';
import express from 'express';
import { getUserConversation } from '../services/users';

const router = express.Router();

router.get('/', (_req, res) => {
	res.json({ message: 'Conversation endpoint is live' });
});

router.get('/conversations/:userId', (req, res) => {
	const { userId } = req.params;
	getUserConversation(userId)
		.then((userConversation) => {
			return res.json({
				conversation: userConversation,
			});
		})
		.catch((error: Error) => {
			res.status(500).json(error);
		});
});

router.get('/:conversationId', (req, res) => {
	const { conversationId } = req.params;
	getConversations(conversationId)
		.then((conversation) => res.json({ conversation }))
		.catch((error: Error) => res.status(500).json(error));
});

router.post('/new', (req, res) => {
	const { recipientId, composedMessage, userId } = req.body;
	if (!recipientId || !composedMessage) {
		return res.status(400).json({ error: 'Please send the correct data' });
	}

	createConversation(recipientId, userId)
		.then((conversation) =>
			createMessage(conversation._id, composedMessage, userId)
		)
		.then((message) => res.json(message))
		.catch((error: Error) => res.status(500).json(error));
});

router.post('', (req, res) => {
	const { conversationId, body, author } = req.body;
	if (!conversationId || !body || !author) {
		return res.status(400).json({
			error: 'You must provide an conversationId and message',
		});
  }
  createMessage(conversationId, body, author)
    .then((message) => res.json(message))
});

export default router;
