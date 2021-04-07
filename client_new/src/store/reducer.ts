import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { setCurrentRecipient } from './action';
import { authUser, getConversations, getMessages, sendMessage } from './actionCreator';
import { IAppState, IConversation, IMessage, IUser } from './types';

const initialState: IAppState = {
	messages: [],
	conversations: [],
	user: {
		firstName: '',
		lastName: '',
		id: '',
	},
	currentRecipient: {
		firstName: '',
		lastName: '',
		id: '',
	},
	currentConversationId: ''
};

export const appReducer = createReducer(initialState, {
	[getConversations.fulfilled.type]: (
		state,
		action: PayloadAction<IConversation[]>
	) => ({ ...state, conversations: action.payload }),
	[getMessages.fulfilled.type]: (state, action: PayloadAction<IMessage[]>) => ({
		...state,
		messages: action.payload,
	}),
	[authUser.fulfilled.type]: (state, action: PayloadAction<IUser>) => ({
		...state,
		user: action.payload,
	}),
	[setCurrentRecipient.type]: (state, action: PayloadAction<IUser & { conversationId: string }>) => ({
		...state,
		currentRecipient: action.payload,
		currentConversationId: action.payload.conversationId
	}),
	[sendMessage.pending.type]: (state, action: {meta: { arg: { authorId: string, message: string, conversationId: string; }, requestId: string }}) => ({
		...state,
		messages: [
			...state.messages,
			{
				_id: action.meta.requestId,
				author: { profile: { firstName: state.user?.firstName, lastName: state.user?.lastName }, _id: state.user?.id},
				body: action.meta.arg.message,
				createdAt: Date.now().toString(),
				isPending: true
			}
		]
	}),
	[sendMessage.fulfilled.type]: (state, action: PayloadAction<IMessage> & { meta: { arg: any, requestId: string } }) => ({
		...state,
		messages: state.messages.map((message) => message['_id'] === action.meta.requestId ? {
			...message,
			createdAt: action.payload.createdAt,
			_id: action.payload._id,
			isPending: false
		}: message),
		conversations: state.conversations.map((conversation) => action.meta.arg.conversationId ? {
			...conversation,
			body:  action.payload.body
		} : conversation )
	})
});
