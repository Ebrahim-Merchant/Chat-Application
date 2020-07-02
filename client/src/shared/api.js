export const getChatMessages = (conversationId) => {
	return new Promise((resolve, reject) =>
		fetch(`/api/conversation/${conversationId}`)
			.then((res) => handleErrors(res))
			.then((res) => {
				if (!res.success) reject(res.error);
				else {
					resolve(res.conversation);
				}
			})
	);
};

export const submitMessage = (
	text,
	conversationId,
	currentUser,
	conversation
) => {
	return new Promise((resolve, reject) => {
		if (!currentUser || !text) reject('currentUser and text required');
		fetch('/api/conversation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ conversationId, author: currentUser, body: text }),
		})
			.then((res) => handleErrors(res))
			.then((message) => {
				conversation.push({ ...message, author: currentUser });
				resolve(conversation);
			});
	});
};

export const getUsers = (currentUserId) => {
	return new Promise((resolve, reject) =>
		fetch(`/api/users/all/${currentUserId}`)
			.then((res) => handleErrors(res))
			.then((resp) => resolve({ users: mapToName(resp.data) }))
			.catch((err) => reject(err))
	);
};

const mapToName = (resp) => {
	return resp.map((author) => ({
		label: ` ${author.profile.firstName} ${author.profile.lastName}`,
		value: author._id,
	}));
};

export const getUserConversations = (userId) => {
	return new Promise((resolve, reject) =>
		fetch(`api/users/conversations/${userId}`)
			.then((res) => handleErrors(res))
			.then((data) => resolve(data.conversations))
			.catch((error) => reject(error))
	);
};

export const getUserProfile = (userId) => {
	return new Promise((resolve, reject) =>
		fetch(`/api/users/${userId}`)
			.then((res) => handleErrors(res))
			.then((data) => resolve(data.userProfile))
			.catch((error) => reject(error))
	);
};

export const registerUser = (firstName, lastName, email, password) => {
	return new Promise((resolve, reject) => {
		if (!firstName || !email || !password) reject('data is missing');
		fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ firstName, lastName, email, password }),
		})
			.then((res) => handleErrors(res))
			.then((user) => resolve(user.userId))
			.catch((error) => reject(error));
	});
};

export const authenitcateUser = (email, password) => {
	return new Promise((resolve, reject) => {
		if (!email || !password) reject('data is missing');
		fetch('/api/auth/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})
			.then((res) => handleErrors(res))
			.then((user) => resolve(user.userId))
			.catch((error) => reject(error));
	});
};

function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response.json();
}
