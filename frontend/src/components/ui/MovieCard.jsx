import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
	const { id, title, poster_path, vote_average, release_date } = movie;
	const { isFavorite, toggleFavorite } = useFavorites();
	const [toggling, setToggling] = useState(false);
	const favorited = isFavorite(id);

	const handleToggleFavorite = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (toggling) return;
		setToggling(true);
		await toggleFavorite(id, movie.media_type || "movie");
		setToggling(false);
	};

	const posterUrl = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

	// Format year
	const year = release_date ? release_date.substring(0, 4) : "Unknown";

	return (
		<motion.div
			whileHover={{ y: -8, scale: 1.02 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className="relative group/card rounded-xl overflow-hidden bg-background aspect-[2/3] shadow-lg border border-border/40">
			{/* Poster Image */}
			<img
				src={posterUrl}
				alt={title}
				className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
				loading="lazy"
			/>

			{/* Hover Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
				{/* Top actions (Play & Favorite) */}
				<div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-8 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-300 delay-100">
					<button
						onClick={handleToggleFavorite}
						disabled={toggling}
						className={`p-2 backdrop-blur-md rounded-full transition-colors ${
							favorited ? "bg-red-500/30 text-red-400 hover:bg-red-500/40" : "bg-white/10 text-white hover:text-red-400 hover:bg-white/20"
						}`}>
						{toggling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" fill={favorited ? "currentColor" : "none"} />}
					</button>
				</div>

				{/* Play Button Center (if needed, but keeping it subtle) */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 group-hover/card:scale-100 group-hover/card:opacity-100 transition-all duration-300">
					<Link
						to={`/${movie.media_type || "movie"}/${id}`}
						className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform">
						<Play className="w-5 h-5 ml-1" fill="currentColor" />
					</Link>
				</div>

				{/* Details Bottom */}
				<div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
					<h3 className="text-white font-bold text-lg line-clamp-1 mb-1">{title}</h3>
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span>{year}</span>
						<div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md font-medium">
							<Star className="w-3 h-3" fill="currentColor" />
							<span>{vote_average ? vote_average.toFixed(1) : "N/A"}</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default MovieCard;
