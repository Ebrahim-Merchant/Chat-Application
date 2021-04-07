import Message from '../database/models/message';
import Conversation from '../database/models/conversation';

export const getConversation = async (userId: string, page: number = 1, limit: number = 100) => {
  return await Conversation.find({ participants: userId }).exec();
}

export const getConversations = async (id : string) => {
  return await Message.find({ conversationId: id })
  .select('createdAt body author')
  .sort('createdAt')
  .populate({
    path: 'author',
    select: 'profile.firstName profile.lastName',
  })
  .exec();
}


export const createConversation = async (recipientId: string, userId: string) => {
  return await new Conversation({
		participants: [userId, recipientId],
	}).save();

}