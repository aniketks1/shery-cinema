import asyncHandler from "../utils/asyncHandler.js";
import {
	addFavoriteService,
	getFavoriteMoviesService,
	getWatchHistoryService,
	addWatchHistoryService,
	removeFavoriteService,
} from "../services/movie.service.js";

/**
 * @desc    Add a movie to user's favorites
 * @route   POST /movies/favorite
 * @access  Private
 */
export const addFavoriteController = asyncHandler(async (req, res) => {
	const { tmdbId } = req.params;
	const { mediaType } = req.body;

	// Service to add the item to favorites
	const result = await addFavoriteService(req.user.userId, tmdbId, mediaType);
	res.status(200).json({
		success: true,
		message: "Item added to favorites successfully",
		data: result,
	});
});

/**
 * @desc    Get user's favorite movies
 * @route   GET /movies/favorites
 * @access  Private
 */
export const getFavoriteMoviesController = asyncHandler(async (req, res) => {
	// Service to get the user's favorite movies
	const favorites = await getFavoriteMoviesService(req.user.userId);

	res.status(200).json({
		success: true,
		message: "Favorite movies retrieved successfully",
		data: favorites,
	});
});

/**
 * @desc    Get user's watch history
 * @route   GET /movies/history
 * @access  Private
 */
export const getWatchHistoryController = asyncHandler(async (req, res) => {
	// Service to get the user's watch history
	const history = await getWatchHistoryService(req.user.userId);

	res.status(200).json({
		success: true,
		message: "Watch history retrieved successfully",
		data: history,
	});
});

/**
 * @desc    Add a movie to user's watch history
 * @route   POST /movies/history
 * @access  Private
 */
export const addWatchHistoryController = asyncHandler(async (req, res) => {
	const { tmdbId } = req.params;
	const { mediaType } = req.body;

	// Service to add the item to watch history
	const result = await addWatchHistoryService(req.user.userId, tmdbId, mediaType);

	res.status(200).json({
		success: true,
		message: "Item added to watch history successfully",
		data: result,
	});
});

/**
 * @desc    Remove a movie from user's favorites
 * @route   DELETE /movie/favorite/:tmdbId
 * @access  Private
 */
export const removeFavoriteController = asyncHandler(async (req, res) => {
	const { tmdbId } = req.params;

	const result = await removeFavoriteService(req.user.userId, tmdbId);

	res.status(200).json({
		success: true,
		message: "Movie removed from favorites successfully",
		data: result,
	});
});
