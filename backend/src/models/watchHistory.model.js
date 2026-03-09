import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
		tmdbId: { type: String, required: true },
		mediaType: { type: String, enum: ['movie', 'tv'], required: true },
	},
	{ timestamps: true },
);

watchHistorySchema.index({ user: 1, tmdbId: 1 }, { unique: true });

const WatchHistoryModel = mongoose.model("watchhistories", watchHistorySchema);
export default WatchHistoryModel;