import mongoose from "mongoose";

const favouritesSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
		tmdbId: { type: String, required: true },
		mediaType: { type: String, enum: ['movie', 'tv'], required: true },
	},
	{ timestamps: true },
);

favouritesSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const FavouritesModel = mongoose.model("favourites", favouritesSchema);
export default FavouritesModel;
