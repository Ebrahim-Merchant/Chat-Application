import { createHash, randomBytes } from 'crypto';

export const getHashedPassword = (password: string): string => {
	return createHash('md5').update(password).digest('hex');
};

export const generateToken = async (): Promise<string> =>
	new Promise((resolve) =>
		randomBytes(48, (err, buffer) => resolve(buffer.toString('hex')))
	);
