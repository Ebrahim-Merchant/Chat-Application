import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';

export const getConversations = createAsyncThunk(
	'GET_CONVERSATION',
	async (userId: string) => {
		return await api.getUserConversations(userId);
	}
);

export const getUsers = createAsyncThunk(
	'GET_USERS',
	async (userId: string) => {
		return await api.getUsers(userId);
	}
);

export const getMessages = createAsyncThunk(
	'GET_MESSAGES',
	async (conversationId: string) => {
		return await api.getChatMessages(conversationId);
	}
);

export const getUserProfile = createAsyncThunk(
	'GET_USER_PROFILE',
	async (userId: string) => {
		return await api.getUserProfile(userId);
	}
);

export const authUser = createAsyncThunk(
	'AUTH_USER',
	async ({email, pass}: any) => {
		return await api.authenitcateUser(email, pass);
	}
);

export const registerUser = createAsyncThunk(
	'AUTH_USER',
	async ({firstName, lastName, email, pass}: any) => {
		return await api.registerUser(firstName, lastName, email, pass);
	}
);

export const sendMessage = createAsyncThunk(
	'SEND_MESSAGE',
	async ({message, conversationId, author}: any) => {
		return await api.submitMessage(message, conversationId, author);
	}
)