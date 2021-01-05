import express from 'express';
import Message from '../models/message';
import Users from '../models/user';
import Conversation from '../models/conversation';

const router = express.Router();

router.delete('/', (_req, res) => {
  Conversation.deleteMany({})
    .then(() => Message.deleteMany({}))
    .then(() => Users.deleteMany({}))
    .then(() => res.status(200))
    .catch(() => res.status(500))
});

export default router;
