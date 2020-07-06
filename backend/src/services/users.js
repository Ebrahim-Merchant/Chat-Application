import User from '../models/user';

export class UserService {
	constructor() {}

	getUser(id) {
		return new Promise((resolve, reject) =>
			User.findById(id).select('_id profile').exec((err, user) => (err ? reject(err) : resolve(user)))
		);
	}
}
