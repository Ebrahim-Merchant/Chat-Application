import { getLatestMessage } from './message';
import { getConversation } from './conversation';
import User, { IUser } from '../database/models/user';
import { getHashedPassword } from './utils';

export interface IUserConversation {
	participants: {
		[id: number]: IUser | null;
  };
  recipientId: string;
}

export const getUsers = async (id: string) =>
	await User.findById(id).select('_id profile').exec();

export const getUserConversation = async (id: string) => {
  const userConversations = await getConversation(id);
  const fullConversations =  userConversations.map(async (conversation) => {
    const message = await getLatestMessage(conversation);
    const [userOne, userTwo] = conversation.participants;

		const recipient = userOne === id ? await getUsers(userTwo) : await getUsers(userOne);

    if(message && message.author) {
      message.author = undefined;
    }

    return {
      ...message?.toObject(),
      participants: conversation.participants,
      recipient
    }
  });

  return await Promise.all(fullConversations);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({email}).exec();
}

export const getUserByEmailAndUpdate = async (email: string, update: any) => {
  return await User.findOneAndUpdate({email}, update).exec();
}

export const getUserByToken = async (token: string) => {
  return await User.findOne({resetPasswordToken: token}).exec();
}

export const updateUser = async (findQuery: {}, updateQuery: {}) => {
  return await User.findOneAndUpdate(findQuery, updateQuery).exec();
}

export const createUser = async (firstName: string, lastName: string, email: string, password: string) => {
  return await new User({
    profile: {
      firstName: firstName,
      lastName: lastName,
    },
    email: email,
    password: getHashedPassword(password)
  }).save();
}