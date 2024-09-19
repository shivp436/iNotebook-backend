import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not defined in environment variables');
	}

	return jwt.sign({ id }, secret, {
		expiresIn: '14d',
	});
};

export { generateToken };