import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Loader2, Film, Tv } from "lucide-react";
import { userActivityAPI } from "../services/api";
import { fetchMovieDetails, fetchTvDetails } from "../services/tmdb";
import MovieCard from "../components/ui/MovieCard";
import SkeletonCard from "../components/ui/SkeletonCard";

const WatchHistory = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		loadHistory();
	}, []);

	const loadHistory = async () => {
		setLoading(true);
		try {
			const { data } = await userActivityAPI.getWatchHistory();
			const items = data.data;

			const detailedItems = await Promise.all(
				items.map(async (entry) => {
					try {
						const details = entry.mediaType === "tv" ? await fetchTvDetails(entry.tmdbId) : await fetchMovieDetails(entry.tmdbId);
						return {
							...details,
							media_type: entry.mediaType,
							watchedAt: entry.createdAt,
						};
					} catch {
						return {
							id: entry.tmdbId,
							media_type: entry.mediaType,
							title: "Unavailable",
							name: "Unavailable",
							watchedAt: entry.createdAt,
						};
					}
				}),
			);

			// Sort by most recently watched
			detailedItems.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
			setHistory(detailedItems);
		} catch (error) {
			if (error.response?.status === 404) {
				setHistory([]);
			} else {
				console.error("Failed to load watch history:", error);
			}
		} finally {
			setLoading(false);
		}
	};

	const filteredHistory = history.filter((item) => {
		if (filter === "all") return true;
		return item.media_type === filter;
	});

	const movieCount = history.filter((h) => h.media_type === "movie").length;
	const tvCount = history.filter((h) => h.media_type === "tv").length;

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
	};

	return (
		<div className="w-full pb-10 min-h-screen">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-blue-500/15 rounded-xl">
						<Clock className="w-6 h-6 text-blue-500" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-white tracking-tight">Watch History</h1>
						{!loading && history.length > 0 && (
							<p className="text-sm text-muted-foreground mt-0.5">
								{history.length} {history.length === 1 ? "item" : "items"} watched
							</p>
						)}
					</div>
				</div>

				{/* Filter Tabs */}
				{!loading && history.length > 0 && (
					<div className="flex bg-background/80 p-1 rounded-xl w-fit border border-border/50">
						<button
							onClick={() => setFilter("all")}
							className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
								filter === "all" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"
							}`}>
							All ({history.length})
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
						<SkeletonCard key={`skel-hist-${i}`} />
					))}
				</div>
			) : history.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
					<Clock className="w-20 h-20 mb-6 text-muted-foreground/20" />
					<h3 className="text-2xl font-semibold text-white mb-2">No watch history yet</h3>
					<p className="text-center max-w-md">Start watching trailers to build your history. Your recently watched content will appear here.</p>
				</div>
			) : filteredHistory.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
					<h3 className="text-xl font-semibold text-white mb-2">No {filter === "movie" ? "movies" : "TV shows"} in your history</h3>
					<button
						onClick={() => setFilter("all")}
						className="mt-4 px-6 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors font-medium">
						Show all history
					</button>
				</div>
			) : (
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
					{filteredHistory.map((item, index) => (
						<motion.div key={`hist-${item.id}-${index}`} variants={itemVariant}>
							<MovieCard movie={item} />
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
};

export default WatchHistory;
