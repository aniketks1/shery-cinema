import FavouritesModel from "../models/favorites.model.js";
import MovieModel from "../models/movie.model.js";
import UserModel from "../models/user.model.js";
import WatchHistoryModel from "../models/watchHistory.model.js";
import AppError from "../utils/appError.js";
import { deleteImage } from "./fileUpload.service.js";

// Service for creating a new movie
export const createMovieService = async (movieData) => {
	const movie = await MovieModel.findOne({ tmdbId: movieData.tmdbId });
	if (movie) throw new AppError("Movie with this TMDB ID already exists.", 400);

	const processedData = {
		...movieData,
		genres: movieData.genres.split(",").map((genre) => genre.trim()),
	};

	const newMovie = new MovieModel(processedData);
	return await newMovie.save();
};

// Service for getting all movies
export const getMoviesService = async (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;
	const movies = await MovieModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
	const total = await MovieModel.countDocuments();
	return { movies, total, page, totalPages: Math.ceil(total / limit) };
};

// Service for getting all users
export const getUsersService = async (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;
	const users = await UserModel.find().select("+isVerified +isBanned").skip(skip).limit(limit).sort({ createdAt: -1 });
	const total = await UserModel.countDocuments();
	return { users, total, page, totalPages: Math.ceil(total / limit) };
};

// Service for updating user details
export const updateUserService = async (userId, updateData, requestingUserId) => {
	if (userId === requestingUserId) {
		throw new AppError("You cannot modify your own account through admin panel.", 400);
	}

	const user = await UserModel.findById(userId);
	if (!user) throw new AppError("User not found.", 404);

	const allowedFields = ["isVerified", "isBanned", "role"];
	const filteredUpdateData = Object.fromEntries(Object.entries(updateData).filter(([key]) => allowedFields.includes(key)));

	return await UserModel.findByIdAndUpdate(userId, filteredUpdateData, { returnDocument: "after" }).select("+isVerified +isBanned");
};

// Service for deleting a movie
export const deleteMovieService = async (movieId) => {
	const movie = await MovieModel.findByIdAndDelete(movieId);
	if (!movie) throw new AppError("Movie not found.", 404);

	// Delete poster from ImageKit
	await deleteImage(movie.posterUrl);

	// Clean up references to this movie
	await FavouritesModel.deleteMany({ tmdbId: movie.tmdbId });
	await WatchHistoryModel.deleteMany({ tmdbId: movie.tmdbId });

	return movie;
};

// Service for updating a movie
export const updateMovieService = async (movieId, updateData) => {
	const movie = await MovieModel.findById(movieId);
	if (!movie) throw new AppError("Movie not found.", 404);

	// If genres is a comma-separated string, convert to array
	if (updateData.genres && typeof updateData.genres === "string") {
		updateData.genres = updateData.genres.split(",").map((genre) => genre.trim());
	}

	const updatedMovie = await MovieModel.findByIdAndUpdate(movieId, updateData, {
		returnDocument: "after",
		runValidators: true,
	});

	return updatedMovie;
};

// Service for deleting a user
export const deleteUserService = async (userId, requestingUserId) => {
	if (userId === requestingUserId) {
		throw new AppError("You cannot delete your own account.", 400);
	}

	const user = await UserModel.findByIdAndDelete(userId);
	if (!user) throw new AppError("User not found.", 404);

	// Clean up related data
	await FavouritesModel.deleteMany({ userId });
	await WatchHistoryModel.deleteMany({ user: userId });

	return user;
};
