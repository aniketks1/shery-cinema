import { verifyToken } from "../utils/token.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import redisClient from "../config/cache.js";
import UserModel from "../models/user.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
	if (!token) throw new AppError("Unauthorized: No token provided", 401);

	// check redis blacklist
	const isBlacklisted = await redisClient.get(token);

	if (isBlacklisted) {
		return res.status(401).json({
			message: "Token is blacklisted. Please login again.",
		});
	}

	const decoded = await verifyToken(token);

	if (!decoded) throw new AppError("Unauthorized: Invalid token", 401);

	req.user = decoded; // Attach user info to request

	// Check if user is banned
	const user = await UserModel.findById(decoded.userId).select("+isBanned");
	if (user?.isBanned) {
		throw new AppError("Your account has been banned. Please contact support for more information.", 403);
	}
	if (!user) throw new AppError("User account no longer exists.", 401);

	next();
});

export default authMiddleware;
