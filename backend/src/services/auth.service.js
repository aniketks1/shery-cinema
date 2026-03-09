import UserModel from "../models/user.model.js";
import AppError from "../utils/appError.js";
import redisClient from "../config/cache.js";
import sendEmail from "./mail.service.js";
import { generateToken } from "../utils/token.js";
import { verificationEmailTemplate } from "../templates/emailTemplates.js";

// Service for user registration
export const userRegisterService = async (userData) => {
	const { fullName, username, email, password } = userData;
	const user = new UserModel({ fullName, username, email, password });

	return await user.save({ validateBeforeSave: true });
};

// Service for email verification
export const verifyEmailService = async (email) => {
	const user = await UserModel.findOneAndUpdate({ email, isVerified: false }, { isVerified: true }, { returnDocument: "after" }).select(
		"+isVerified",
	);

	if (!user) {
		throw new AppError("Invalid or expired verification link", 400);
	}

	return user;
};

// Service for resending verification email
export const sendVerificationEmailService = async (email) => {
	const user = await UserModel.findOne({ email }).select("+isVerified");
	if (!user) {
		throw new AppError("User not found", 404);
	}

	if (user.isVerified) {
		throw new AppError("Email is already verified", 400);
	}

	// Generate new verification token
	const verificationToken = generateToken(
		{
			userId: user._id,
			email: user.email,
		},
		"10m",
	);

	// Construct verification link
	const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

	// Send verification email
	await sendEmail({
		to: user.email,
		subject: "Verify Your Email - Shery Cinema",
		html: verificationEmailTemplate(user.fullName, verificationLink),
	});

	return { message: "Verification email resent successfully" };
};

// Service for user login
export const userLoginService = async (userData) => {
	// extract username and password
	const { username, password } = userData;

	// Find user by username
	const user = await UserModel.findOne({ username }).select("+password +isVerified +isBanned");
	if (!user) {
		throw new AppError("Invalid username or password", 401);
	}

	// Check if user is banned
	if (user.isBanned) throw new AppError("Your account has been banned. Contact support for more information.", 403);

	// Check if password matches
	const isMatch = await user.comparePassword(password);
	if (!isMatch) throw new AppError("Invalid username or password", 401);

	// Check if email is verified
	if (!user.isVerified) throw new AppError("Email not verified. Please verify your email to login.", 403);

	// conver the mongoose document to a plain JavaScript object
	const userObj = user.toObject();

	// Remove sensitive fields before returning user object
	delete userObj.password;
	delete userObj.isVerified;
	delete userObj.isBanned;

	return userObj;
};

// Service for user logout
export const userLogoutService = async (data) => {
	// Invalidate the user's session or token
	const { token, ttl } = data;
	await redisClient.set(token, "blacklisted", "EX", ttl);
};

// Service for getting user profile
export const getUserProfileService = async (userData) => {
	// Extract userId and email from userData and fetch user profile from database
	const { userId } = userData;
	const user = await UserModel.findById(userId).select("-password -isVerified");

	if (!user) {
		throw new AppError("User not found", 404);
	}

	return user;
};
