import Conversation from '../models/converstation';
import Message from '../models/message';
import { UserService } from './users';


export class ConversationsService {

	constructor() {
		this.userService = new UserService(); 

	}

	getConversations(res, next, userId) {
		return Conversation.find({ participants: userId })
			.exec((err, conversations) => {
				if (err) {
					res.send({ error: err });
					return next(err);
				}

				// Set up empty array to hold conversations + most recent message
				const fullConversations = [];

				conversations.map((conversation) => {
					Message.findOne({ conversationId: conversation._id })
						.sort('-createdAt')
						.limit(1)
						.populate({
							path: 'authorId',
							select: 'profile._id',
						})
						.exec(async (err, message) => {
							if (err) {
								res.send({ error: err });
								return next(err);
							}					
							
							const participants = {};
							participants[conversation.participants[0]] = await this.userService.getUser(conversation.participants[0]);
							participants[conversation.participants[1]] = await this.userService.getUser(conversation.participants[1]);
							const messageObj = message.toObject();
							message['recipientId'] = conversation.participants[0] === userId ? conversation.participants[0] : conversation.participants[1];
							fullConversations.push({
								...messageObj,
								participants
							});
							if (fullConversations.length === conversations.length) {
								return res
									.status(200)
									.json({ conversations: fullConversations });
							}
						});
				});
			});
	}
}
