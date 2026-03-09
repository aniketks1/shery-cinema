import mongoose from "mongoose";

// Database connection
const connectDB = async () => {
	const dbUrl = process.env.MONGODB_URI;
	const dbName = process.env.DB_NAME;
	if (!dbUrl || !dbName) throw new Error("Database URL and name must be provided in environment variables");

	await mongoose.connect(`${dbUrl}/${dbName}`);
	console.log("Plugged in to MongoDB");
};

export default connectDB;
