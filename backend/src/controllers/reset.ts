import express from 'express';
import Message from '../database/models/message';
import Users from '../database/models/user';
import Conversation from '../database/models/conversation';

const router = express.Router();

router.delete('/', (_req, res) => {
  Conversation.deleteMany({})
    .then(() => Message.deleteMany({}))
    .then(() => Users.deleteMany({}))
    .then(() => res.status(200))
    .catch(() => res.status(500))
});

export default router;
