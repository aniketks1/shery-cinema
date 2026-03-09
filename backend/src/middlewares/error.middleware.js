// Development error handler
function sendDevError(err, res) {
	res.status(err.statusCode || 500).json({
		status: err.status || "error",
		message: err.message,
		stack: err.stack,
	});
}

// Production error handler
function sendProdError(err, res) {
	if (err.isOperational) {
		res.status(err.statusCode || 500).json({
			status: err.status || "error",
			message: err.message,
		});
	} else {
		console.error("Unexpected error:", err);
		res.status(500).json({
			status: "error",
			message: "Something went wrong!",
		});
	}
}

export default function errorHandler(err, req, res, next) {
	if (process.env.NODE_ENV === "development") sendDevError(err, res);
	else sendProdError(err, res);
}
