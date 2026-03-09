import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Loader2, Trash2, Film, Tv } from "lucide-react";
import { fetchMovieDetails, fetchTvDetails } from "../services/tmdb";
import { useFavorites } from "../hooks/useFavorites";
import MovieCard from "../components/ui/MovieCard";
import SkeletonCard from "../components/ui/SkeletonCard";

const Favorites = () => {
	const { favMap, toggleFavorite, loaded } = useFavorites();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [removingId, setRemovingId] = useState(null);
	const [filter, setFilter] = useState("all"); // "all", "movie", "tv"

	// Re-fetch TMDB details whenever the favMap changes
	useEffect(() => {
		if (!loaded) return;
		const entries = Object.entries(favMap);
		if (entries.length === 0) {
			setFavorites([]);
			setLoading(false);
			return;
		}

		let cancelled = false;
		const load = async () => {
			setLoading(true);
			const detailedItems = await Promise.all(
				entries.map(async ([tmdbId, { mediaType }]) => {
					try {
						const details = mediaType === "tv" ? await fetchTvDetails(tmdbId) : await fetchMovieDetails(tmdbId);
						return { ...details, media_type: mediaType, tmdbId };
					} catch {
						return { id: tmdbId, media_type: mediaType, tmdbId, title: "Unavailable", name: "Unavailable" };
					}
				}),
			);
			if (!cancelled) {
				setFavorites(detailedItems);
				setLoading(false);
			}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [favMap, loaded]);

	const handleRemoveFavorite = async (tmdbId) => {
		setRemovingId(tmdbId);
		try {
			await toggleFavorite(tmdbId, favMap[String(tmdbId)]?.mediaType || "movie");
		} finally {
			setRemovingId(null);
		}
	};

	const filteredFavorites = favorites.filter((item) => {
		if (filter === "all") return true;
		return item.media_type === filter;
	});

	const movieCount = favorites.filter((f) => f.media_type === "movie").length;
	const tvCount = favorites.filter((f) => f.media_type === "tv").length;

	const container = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.08 } },
	};

	const itemVariant = {
		hidden: { opacity: 0, scale: 0.9, y: 20 },
		show: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", stiffness: 300, damping: 24 },
		},
		exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
	};

	return (
		<div className="w-full pb-10 min-h-screen">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-red-500/15 rounded-xl">
						<Heart className="w-6 h-6 text-red-500" fill="currentColor" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-white tracking-tight">My Favorites</h1>
						{!loading && favorites.length > 0 && (
							<p className="text-sm text-muted-foreground mt-0.5">
								{favorites.length} {favorites.length === 1 ? "item" : "items"} saved
							</p>
						)}
					</div>
				</div>

				{/* Filter Tabs */}
				{!loading && favorites.length > 0 && (
					<div className="flex bg-background/80 p-1 rounded-xl w-fit border border-border/50">
						<button
							onClick={() => setFilter("all")}
							className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
								filter === "all" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"
							}`}>
							All ({favorites.length})
						</button>
						<button
							onClick={() => setFilter("movie")}
							className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
								filter === "movie" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"
							}`}>
							<Film className="w-3.5 h-3.5" />
							Movies ({movieCount})
						</button>
						<button
							onClick={() => setFilter("tv")}
							className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
								filter === "tv" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"
							}`}>
							<Tv className="w-3.5 h-3.5" />
							TV ({tvCount})
						</button>
					</div>
				)}
			</div>

			{/* Content */}
			{loading ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{[...Array(10)].map((_, i) => (
						<SkeletonCard key={`skel-fav-${i}`} />
					))}
				</div>
			) : favorites.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
					<Heart className="w-20 h-20 mb-6 text-muted-foreground/20" />
					<h3 className="text-2xl font-semibold text-white mb-2">No favorites yet</h3>
					<p className="text-center max-w-md">Start adding movies and TV shows to your favorites by clicking the heart icon on any title.</p>
				</div>
			) : filteredFavorites.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
					<h3 className="text-xl font-semibold text-white mb-2">No {filter === "movie" ? "movies" : "TV shows"} in your favorites</h3>
					<button
						onClick={() => setFilter("all")}
						className="mt-4 px-6 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors font-medium">
						Show all favorites
					</button>
				</div>
			) : (
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					<AnimatePresence mode="popLayout">
						{filteredFavorites.map((item) => (
							<motion.div key={`fav-${item.tmdbId}`} variants={itemVariant} layout exit="exit" className="relative group/fav">
								<MovieCard movie={item} />
								{/* Remove button overlay */}
								<button
									onClick={() => handleRemoveFavorite(item.tmdbId)}
									disabled={removingId === item.tmdbId}
									className="absolute top-2 left-2 z-10 p-2 bg-black/60 backdrop-blur-md rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all opacity-0 group-hover/fav:opacity-100 disabled:opacity-50"
									title="Remove from favorites">
									{removingId === item.tmdbId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
								</button>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			)}
		</div>
	);
};

export default Favorites;
