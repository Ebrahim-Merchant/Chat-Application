import { IConversation, IMessage } from "../store/types";

export const getChatMessages = (conversationId: string) => {
	return new Promise((resolve) =>
		fetch(`/api/conversation/${conversationId}`)
			.then((res) => handleErrors(res))
			.then((res) => resolve(res.conversation))
	);
};

export const submitMessage = (
	body: string,
	conversationId: string,
	author: string,
): Promise<IMessage> => {
	return new Promise<IMessage>((resolve, reject) => {
		if (!author || !body) reject('currentUser and text required');
		console.log(body, conversationId, author);
		fetch('/api/conversation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ conversationId, author, body }),
		})
			.then((res) => handleErrors(res))
			.then((message: IMessage) => resolve(message));
	});
};

export const getUsers = (currentUserId: string) => {
	return new Promise((resolve, reject) =>
		fetch(`/api/users/all/${currentUserId}`)
			.then((res) => handleErrors(res))
			.then((resp) => resolve({ users: mapToName(resp.data) }))
			.catch((err) => reject(err))
	);
};

const mapToName = (resp: any) => {
	return resp.map((author: any) => ({
		label: ` ${author.profile.firstName} ${author.profile.lastName}`,
		value: author._id,
	}));
};

export const getUserConversations = (
	userId: string
): Promise<IConversation> => {
	return new Promise((resolve, reject) =>
		fetch(`api/users/conversations/${userId}`)
			.then((res) => handleErrors(res))
			.then((data) => resolve(data.conversations))
			.catch((error) => reject(error))
	);
};

export const getUserProfile = (userId: string) => {
	return new Promise((resolve, reject) =>
		fetch(`/api/users/${userId}`)
			.then((res) => handleErrors(res))
			.then((data) => resolve(data.userProfile))
			.catch((error) => reject(error))
	);
};

export const registerUser = (
	firstName: string,
	lastName: string,
	email: string,
	password: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!firstName || !email || !password) reject('data is missing');
		fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ firstName, lastName, email, password }),
		})
			.then((res) => handleErrors(res))
			.then((user) => resolve(user))
			.catch((error) => reject(error));
	});
};

export const authenitcateUser = (
	email: string,
	password: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!email || !password) reject('data is missing');
		fetch('/api/auth/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})
			.then((res) => handleErrors(res))
			.then((user) => resolve(user))
			.catch((error) => reject(error));
	});
};

function handleErrors(response: Response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response.json();
}
