import express from "express";

import * as adminController from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createMovieValidation, updateMovieValidation, userIdParamValidation, updateUserValidation } from "../validation/admin.validation.js";

const router = express.Router();

// Apply auth + admin check to all admin routes
router.use(authMiddleware, adminMiddleware);

/**
 * @name   MovieRoutes
 * @route /movie
 * @description Movie-related routes (CRUD operations, search, etc.)
 * @access Admin Only
 */
router.post("/movie", upload.single("poster"), createMovieValidation, adminController.createMovieController);

/**
 * @route GET /movie
 * @description Get a list of movies with optional filters (genre, release year, etc.)
 * @access Admin Only
 */
router.get("/movie", adminController.getMoviesController);

/**
 * @route GET /users
 * @description Get a list of users
 * @access Admin only
 */
router.get("/user", adminController.getUsersController);

/**
 * @route PATCH /user/:id
 * @description Update user details (admin only)
 * @access Admin Only
 */
router.patch("/user/:userId", updateUserValidation, adminController.updateUserController);

/**
 * @route DELETE /admin/movie/:movieId
 * @description Delete a movie by its ID
 * @access Admin Only
 */
router.delete("/movie/:movieId", adminController.deleteMovieController);

/**
 * @route PATCH /admin/movie/:movieId
 * @description Update movie details (admin only)
 * @access Admin Only
 */
router.patch("/movie/:movieId", upload.single("poster"), updateMovieValidation, adminController.updateMovieController);

/**
 * @route DELETE /admin/user/:userId
 * @description Delete a user by their ID (admin only)
 * @access Admin Only
 */
router.delete("/user/:userId", userIdParamValidation, adminController.deleteUserController);

// Export the router to be used in the main app
export default router;
