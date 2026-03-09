import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import * as movieController from "../controllers/movie.controller.js";

const router = express.Router();

/**
 * @route POST /movies/favorite
 * @description Add a movie to the user's list of favorite movies.
 * @access Private
 */
router.post("/favorite/:tmdbId", authMiddleware, movieController.addFavoriteController);

/**
 * @route GET /movies/favorites
 * @description Get the user's list of favorite movies.
 * @access Private
 */
router.get("/favorites", authMiddleware, movieController.getFavoriteMoviesController);

/**
 * @route GET /movies/history
 * @description Get the user's watch history.
 * @access Private
 */
router.get("/history", authMiddleware, movieController.getWatchHistoryController);

/**
 * @route POST /movies/history/:tmdbId
 * @description Add a movie to the user's watch history.
 * @access Private
 */
router.post("/history/:tmdbId", authMiddleware, movieController.addWatchHistoryController);

/**
 * @route DELETE /movie/favorite/:tmdbId
 * @description Remove a movie from the user's favorites.
 * @access Private
 */
router.delete("/favorite/:tmdbId", authMiddleware, movieController.removeFavoriteController);

// Export the router to be used in app.js
export default router;
