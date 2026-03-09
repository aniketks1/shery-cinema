import { body, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ success: false, errors: errors.array() });
	}
	next();
}

export const createMovieValidation = [
	body("tmdbId").notEmpty().withMessage("TMDB ID is required"),
	body("title").notEmpty().withMessage("Title is required").trim(),
	body("description").notEmpty().withMessage("Description is required").trim(),
	body("category").notEmpty().withMessage("Category is required").isIn(["movie", "tv-show"]).withMessage("Category must be 'movie' or 'tv-show'"),
	body("youTubeTrailerUrl")
		.notEmpty()
		.withMessage("YouTube trailer URL is required")
		.matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
		.withMessage("Please enter a valid YouTube URL"),
	body("genres").notEmpty().withMessage("At least one genre is required"),
	body("releaseDate").notEmpty().withMessage("Release date is required").isISO8601().withMessage("Release date must be a valid date"),
	validateRequest,
];

export const updateMovieValidation = [
	param("movieId").isMongoId().withMessage("Invalid movie ID"),
	body("category").optional().isIn(["movie", "tv-show"]).withMessage("Category must be 'movie' or 'tv-show'"),
	body("youTubeTrailerUrl")
		.optional()
		.matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
		.withMessage("Please enter a valid YouTube URL"),
	body("releaseDate").optional().isISO8601().withMessage("Release date must be a valid date"),
	validateRequest,
];

export const userIdParamValidation = [param("userId").isMongoId().withMessage("Invalid user ID"), validateRequest];

export const updateUserValidation = [
	param("userId").isMongoId().withMessage("Invalid user ID"),
	body("role").optional().isIn(["user", "admin"]).withMessage("Role must be 'user' or 'admin'"),
	body("isBanned").optional().isBoolean().withMessage("isBanned must be a boolean"),
	body("isVerified").optional().isBoolean().withMessage("isVerified must be a boolean"),
	validateRequest,
];
