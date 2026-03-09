import {
	userRegisterService,
	verifyEmailService,
	userLoginService,
	userLogoutService,
	getUserProfileService,
	sendVerificationEmailService,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken, verifyToken } from "../utils/token.js";
import redisClient from "../config/cache.js";

/**
 * @desc    User Registration Controller
 * @route   POST /auth/register
 * @access  Public
 */
export const userRegisterController = asyncHandler(async (req, res) => {
	// Extract user details and send to service for registration
	const { fullName, username, email, password } = req.body;
	const user = await userRegisterService({ fullName, username, email, password });

	const { message } = await sendVerificationEmailService(email);

	if (!message) {
		return res.status(500).json({
			success: false,
			message: "Failed to send verification email. Please try again.",
		});
	}

	// respond with user details (excluding password)
	res.status(201).json({
		success: true,
		message: "User registered successfully. Please check your email to verify your account.",
		user: {
			id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
		},
	});
});

/**
 * @desc    Email Verification Controller
 * @route   PATCH /auth/verify-email
 * @access  Public
 */
export const emailVerificationController = asyncHandler(async (req, res) => {
	// Extract token from query parameters
	const { token } = req.body;

	// Verify token and extract payload
	const decoded = verifyToken(token);
	if (!decoded) {
		return res.status(400).json({
			success: false,
			message: "Invalid or expired token",
		});
	}

	// Call service to verify email
	const user = await verifyEmailService(decoded.email);

	// Generate auth token for the user and set to cookie for better UX
	const authToken = generateToken({ userId: user._id, email: user.email, role: user.role }, "7d");
	res.cookie("token", authToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	// Respond with success message
	res.status(200).json({
		success: true,
		message: "Email verified successfully",
		token: authToken,
		user: user,
	});
});

/**
 * @desc    Resend Verification Email Controller
 * @route   POST /auth/resend-verification
 * @access  Public
 */
export const resendVerificationEmailController = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// Call service to resend verification email
	const { message } = await sendVerificationEmailService(email);

	// Respond with success message
	res.status(200).json({
		success: true,
		message,
	});
});

/**
 * @desc    User Login Controller
 * @route   POST /auth/login
 * @access  Public
 */
export const userLoginController = asyncHandler(async (req, res) => {
	// Extract login credentials and validate in service
	const { username, password } = req.body;
	const user = await userLoginService({ username, password });

	// Generate auth token and set to cookie
	const authToken = generateToken({ userId: user._id, email: user.email, role: user.role }, "7d");
	res.cookie("token", authToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	// Respond with user details (excluding password) and add token for Redux
	res.status(200).json({
		success: true,
		message: "Login successful",
		token: authToken,
		user: {
			id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			role: user.role,
		},
	});
});

/**
 * @desc    User Logout Controller
 * @route   POST /auth/logout
 * @access  Private
 */
export const userLogoutController = asyncHandler(async (req, res) => {
	// Extract token from cookies
	const token = req.cookies.token;

	// Check if token is already blacklisted
	const isBlacklisted = await redisClient.get(token);
	if (isBlacklisted) {
		return res.status(400).json({
			success: false,
			message: "You are already logged out",
		});
	}

	// Calculate TTL for the token and blacklist it in Redis
	const ttl = req.user.exp - Math.floor(Date.now() / 1000);
	if (ttl <= 0) {
		// Token is already expired, no need to blacklist
		res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
		return res.status(200).json({ success: true, message: "Logout successful" });
	}
	await userLogoutService({ token, ttl });

	// Clear the authentication cookie
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	// Respond with success message
	res.status(200).json({
		success: true,
		message: "Logout successful",
	});
});

/**
 * @desc    Get User Profile Controller
 * @route   GET /auth/profile
 * @access  Private
 */
export const getUserProfileController = asyncHandler(async (req, res) => {
	// extract data
	const { userId, email } = req.user;

	// Call service to get user profile
	const user = await getUserProfileService({ userId, email });

	// Respond with user profile details
	res.status(200).json({
		success: true,
		user: {
			id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			role: user.role,
		},
	});
});
