import express from "express";
import * as authContoller from "../controllers/auth.controller.js";
import { loginValidation, registerValidation } from "../validation/auth.validation.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerValidation, authContoller.userRegisterController);

/**
 * @route PATCH /auth/verify-email
 * @desc Verify user's email address
 * @access Public
 */
router.patch("/verify-email", authContoller.emailVerificationController);

/**
 * @route POST /auth/resend-verification-email
 * @desc Resend email verification link
 * @access Public
 */
router.post("/resend-verification-email", authContoller.resendVerificationEmailController);

/**
 * @route POST /auth/login
 * @desc Authenticate user and return token
 * @access Public
 */
router.post("/login", loginValidation, authContoller.userLoginController);

/**
 * @route POST /auth/logout
 * @desc Logout user by blacklisting their token
 * @access Private
 */
router.post("/logout", authMiddleware, authContoller.userLogoutController);

/**
 * @route GET /auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get("/me", authMiddleware, authContoller.getUserProfileController);

export default router;
