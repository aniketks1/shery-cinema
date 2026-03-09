import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Middlewares Imports
import errorHandler from "./middlewares/error.middleware.js";

// Routes Imports
import authRoutes from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import movieRouter from "./routes/movie.route.js";

// App initialization
const app = express();

// Middlewares
app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
/**
 * @name   AuthRoutes
 * @route /auth
 * @description Authentication routes (login, register, logout, etc.)
 * @access Public
 */
app.use("/auth", authRoutes);

/**
 * @name   AdminRoutes
 * @route /admin
 * @description Admin-specific routes (user management, site settings, etc.)
 * @access Private (Admin only)
 */
app.use("/admin", adminRouter);

/**
 * @name   MovieRoutes
 * @route /movies
 * @description Movie-related routes (setting favorite and watch history)
 * @access Private (Authenticated users only)
 */
app.use("/movie", movieRouter);

// Error handling middleware
app.use(errorHandler);

// Exporting app
export default app;
