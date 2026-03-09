import AppError from "../utils/appError.js";

const adminMiddleware = (req, res, next) => {
	if (req.user.role !== "admin") {
		throw new AppError("Forbidden: Only admins can access this resource.", 403);
	}
	next();
};

export default adminMiddleware;
