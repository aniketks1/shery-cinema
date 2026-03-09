import asyncHandler from "../utils/asyncHandler.js";
import {
	createMovieService,
	getMoviesService,
	getUsersService,
	updateUserService,
	deleteMovieService,
	updateMovieService,
	deleteUserService,
} from "../services/admin.service.js";
import uploadImage from "../services/fileUpload.service.js";
import AppError from "../utils/appError.js";

// Controller for creating a new movie
export const createMovieController = asyncHandler(async (req, res) => {
	// Extract user information from the request
	const { role } = req.user;
	if (role !== "admin") throw new AppError("Forbidden: Only admins can access this resource.", 403);
	if (!req.file) throw new AppError("Poster image is required", 400);
	// console.log(req.file);
	// call image upload service
	const posterUrl = await uploadImage(req.body.title, req.file);
	if (!posterUrl) throw new AppError("Invalid file", 400);

	// console.log({...req.body, posterUrl});
	// create the movie data and call the database service
	const movieData = { ...req.body, posterUrl };
	const movie = await createMovieService(movieData);

	res.status(201).json({ success: true, message: "Movie created successfully", movie });
});

// Controller for fetching movies
export const getMoviesController = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20;

	const result = await getMoviesService(page, limit);

	if (result.movies.length === 0) return res.status(404).json({ message: "No movies found." });

	res.status(200).json({ success: true, message: "Movies fetched successfully", ...result });
});

// Controller for fetching users
export const getUsersController = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20;

	const result = await getUsersService(page, limit);

	if (result.users.length === 0) return res.status(404).json({ success: false, message: "No users found." });

	res.status(200).json({ success: true, message: "Users fetched successfully", ...result });
});

// Controller for updating user details
export const updateUserController = asyncHandler(async (req, res) => {
	// Extract user ID from the request parameters
	const { userId } = req.params;

	// Call the update user service
	const updatedUser = await updateUserService(userId, req.body, req.user.userId);
	if (!updatedUser) return res.status(404).json({ success: false, message: "User not found." });

	res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
});

// Controller for deleting a movie
export const deleteMovieController = asyncHandler(async (req, res) => {
	const { movieId } = req.params;

	const deletedMovie = await deleteMovieService(movieId);

	res.status(200).json({ success: true, message: "Movie deleted successfully", movie: deletedMovie });
});

// Controller for updating a movie
export const updateMovieController = asyncHandler(async (req, res) => {
	const { movieId } = req.params;

	// If a new poster file is uploaded, upload it and add URL to update data
	let updateData = { ...req.body };
	if (req.file) {
		const posterUrl = await uploadImage(req.body.title || "movie", req.file);
		if (!posterUrl) throw new AppError("Failed to upload image", 400);
		updateData.posterUrl = posterUrl;
	}

	const updatedMovie = await updateMovieService(movieId, updateData);

	res.status(200).json({ success: true, message: "Movie updated successfully", movie: updatedMovie });
});

// Controller for deleting a user
export const deleteUserController = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const deletedUser = await deleteUserService(userId, req.user.userId);

	res.status(200).json({ success: true, message: "User deleted successfully", user: deletedUser });
});
