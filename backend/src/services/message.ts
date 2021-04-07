import { IConversation } from "../database/models/conversation";
import Message from "../database/models/message";

export const getLatestMessage = async ({ _id }: IConversation) => {
	return await Message.findOne({ conversationId: _id })
		.sort('-createdAt')
		.populate({
      path: "author",
      select: "profile.firstName profile.lastName"
    })
		.exec();
};

export const createMessage = async (
	conversationId: string,
	body: string,
	author: string
) => {
	return await new Message({
		conversationId,
		body,
		author,
	}).save();
};
