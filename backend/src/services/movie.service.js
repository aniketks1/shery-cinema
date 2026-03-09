import UserModel from "../models/user.model.js";
import FavouritesModel from "../models/favorites.model.js";
import AppError from "../utils/appError.js";
import WatchHistoryModel from "../models/watchHistory.model.js";

// service to add movie to favorites
export const addFavoriteService = async (userId, tmdbId, mediaType) => {
	const user = await UserModel.findById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	// Check if the movie is already in favorites
	if (await FavouritesModel.findOne({ tmdbId, userId })) {
		throw new AppError("Item already in favorites", 400);
	}

	if (!mediaType) {
		throw new AppError("mediaType is required (movie/tv)", 400);
	}

	// Add the item to user's favorites
	const result = await FavouritesModel.create({ userId, tmdbId, mediaType });

	return result;
};

// service to get user's favorite movies
export const getFavoriteMoviesService = async (userId) => {
	const user = await UserModel.findById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	// Get the user's favorite movies
	const favorites = await FavouritesModel.find({ userId });
	if (!favorites || favorites.length === 0) {
		throw new AppError("No favorite movies found", 404);
	}

	return favorites;
};

// service to get user's watch history
export const getWatchHistoryService = async (userId) => {
	const user = await UserModel.findById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	// Get the user's watch history
	const history = await WatchHistoryModel.find({ user: userId });
	if (!history || history.length === 0) {
		throw new AppError("No watch history found", 404);
	}

	return history;
};

// service to add movie to watch history
export const addWatchHistoryService = async (userId, tmdbId, mediaType) => {
	const user = await UserModel.findById(userId);
	if (!user) {
		throw new AppError("User not found", 404);
	}

	// Check if the item is already in watch history
	if (await WatchHistoryModel.findOne({ tmdbId, user: userId })) return; // Item already in watch history, no need to add again

	if (!mediaType) {
		throw new AppError("mediaType is required (movie/tv)", 400);
	}

	// Add the item to user's watch history
	const result = await WatchHistoryModel.create({ user: userId, tmdbId, mediaType });
	return result;
};

// Service to remove a movie from favorites
export const removeFavoriteService = async (userId, tmdbId) => {
	const favorite = await FavouritesModel.findOneAndDelete({ userId, tmdbId });
	if (!favorite) {
		throw new AppError("Movie not found in favorites", 404);
	}
	return favorite;
};
