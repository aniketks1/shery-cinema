import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

export const registerValidation = [
	body("fullName")
		.notEmpty()
		.withMessage("Full name is required")
		.isLength({ min: 3 })
		.withMessage("Full name must be at least 3 characters long"),
	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ min: 3, max: 30 })
		.withMessage("Username must be between 3 and 30 characters long"),
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email"),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	validateRequest,
];

export const loginValidation = [
	body("username").notEmpty().withMessage("Username is required"),
	body("password").notEmpty().withMessage("Password is required"),
	validateRequest,
];
