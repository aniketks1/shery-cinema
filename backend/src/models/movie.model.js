import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
	{
		tmdbId: {
			type: String,
			required: [true, "TMDB ID is required"],
			unique: true,
			index: true,
		},
		title: {
			type: String,
			required: [true, "Movie title is required"],
		},
		description: {
			type: String,
			required: [true, "Movie description is required"],
		},
		category: {
			type: String,
			required: [true, "Movie category is required"],
			enum: ["movie", "tv-show"],
		},
		posterUrl: {
			type: String,
			required: [true, "Movie poster URL is required"],
		},
		youTubeTrailerUrl: {
			type: String,
			required: [true, "YouTube trailer URL is required"],
			match: [/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, "Please enter a valid YouTube URL"],
		},
		genres: {
			type: [String],
			required: [true, "At least one genre is required"],
		},
		releaseDate: {
			type: Date,
			required: [true, "Release date is required"],
		},
	},
	{ timestamps: true },
);

const MovieModel = mongoose.model("movies", movieSchema);
export default MovieModel;
