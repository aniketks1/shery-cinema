import jwt from "jsonwebtoken";

export function generateToken(data, ttl = "7d") {
	return jwt.sign(data, process.env.JWT_SECRET, {
		expiresIn: ttl,
	});
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return null;
	}
}
