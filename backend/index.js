import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
// import { connectRedis } from "./src/config/cache.js";

// Validate critical environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI", "DB_NAME"];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.error(`FATAL: Missing required environment variable: ${envVar}`);
		process.exit(1);
	}
}

// Constants
const PORT = process.env.PORT || 5000;

try {
	await connectDB();
	// await connectRedis();
} catch (error) {
	console.error("Failed to connect to the database:", error);
	process.exit(1); // Exit with failure
}

// start server & connect to database
app.listen(PORT, async () => {
	console.log(`Server is screening on port ${PORT}`);
});
