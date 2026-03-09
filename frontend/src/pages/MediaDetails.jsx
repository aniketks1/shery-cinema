import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails, fetchTvDetails } from "../services/tmdb";
import { userActivityAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Calendar, Clock, X, AlertCircle } from "lucide-react";
import MovieCard from "../components/ui/MovieCard";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MediaDetails = () => {
	const { mediaType, id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showTrailer, setShowTrailer] = useState(false);
	const [trailerKey, setTrailerKey] = useState(null);

	useEffect(() => {
		const loadMedia = async () => {
			setLoading(true);
			try {
				let data;
				if (mediaType === "tv") {
					data = await fetchTvDetails(id);
				} else {
					data = await fetchMovieDetails(id);
				}
				setMovie(data);

				// Find official trailer (YouTube)
				if (data.videos && data.videos.results) {
					const trailer =
						data.videos.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer") ||
						data.videos.results.find((vid) => vid.site === "YouTube"); // Fallback to any YT video

					if (trailer) {
						setTrailerKey(trailer.key);
					}
				}
			} catch (error) {
				console.error(`Failed to load ${mediaType} details:`, error);
			} finally {
				setLoading(false);
			}
		};

		if (id && mediaType) {
			loadMedia();
		}
	}, [id, mediaType]);

	const handleWatchTrailer = async () => {
		setShowTrailer(true);
		// Fire and forget watch history insertion (assuming user is logged in, but backend will reject if not)
		try {
			await userActivityAPI.addWatchHistory(id, mediaType);
		} catch (error) {
			console.error("Watch history tracking failed:", error);
		}
	};

	if (loading) {
		return (
			<div className="w-full h-[80vh] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="w-full h-[80vh] flex flex-col items-center justify-center text-muted-foreground">
				<AlertCircle className="w-12 h-12 mb-4 text-destructive/50" />
				<h2 className="text-xl font-medium">Content not found</h2>
				<button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">
					Go Back
				</button>
			</div>
		);
	}

	const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null;
	const releaseDate = movie.release_date || movie.first_air_date;
	const releaseYear = releaseDate ? releaseDate.split("-")[0] : "Unknown";
	const runtimeVal = mediaType === "tv" && movie.episode_run_time ? movie.episode_run_time[0] : movie.runtime;
	const runtime = runtimeVal
		? `${Math.floor(runtimeVal / 60)}h ${runtimeVal % 60}m`
		: mediaType === "tv"
			? `${movie.number_of_seasons} Seasons`
			: "Unknown";
	const title = movie.title || movie.name;

	return (
		<div className="-mx-4 md:-mx-8 -mt-20 relative min-h-screen">
			{/* Backdrop Hero Section */}
			<div className="relative h-[60vh] md:h-[70vh] w-full bg-background overflow-hidden">
				{backdropUrl ? (
					<motion.img
						initial={{ opacity: 0, scale: 1.1 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1 }}
						src={backdropUrl}
						alt={title}
						className="w-full h-full object-cover object-top opacity-50 md:opacity-70"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-background to-primary/20"></div>
				)}

				{/* Gradient Fades */}
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-32"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>

				{/* Content Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-5 md:p-12 z-10">
					<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl">
						{/* Genres */}
						<div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
							{movie.genres?.map((genre) => (
								<span
									key={genre.id}
									className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] md:text-xs font-medium backdrop-blur-md">
									{genre.name}
								</span>
							))}
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg leading-tight">{title}</h1>

						{movie.tagline && (
							<p className="text-base sm:text-lg md:text-xl text-primary/80 italic mb-4 font-medium drop-shadow-md line-clamp-2">"{movie.tagline}"</p>
						)}

						<div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-muted-foreground font-medium mb-5 md:mb-6">
							<div className="flex items-center gap-1.5 text-yellow-500">
								<Star className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
								<span className="text-white">{movie.vote_average?.toFixed(1)}</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Calendar className="w-4 h-4 md:w-5 md:h-5" />
								<span>{releaseYear}</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="w-4 h-4 md:w-5 md:h-5" />
								<span>{runtime}</span>
							</div>
						</div>

						{/* Watch Trailer Button - Placed Prominently Above Overview */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleWatchTrailer}
							className="bg-white text-black hover:bg-white/90 font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3 mb-5 md:mb-6 text-sm md:text-base w-full sm:w-auto">
							<Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
							Watch Trailer
						</motion.button>

						<p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none selection:bg-primary/30">
							{movie.overview || "Description not available."}
						</p>

						{/* Additional Metadata */}
						<div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-6">
							<div>
								<h4 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Status</h4>
								<p className="text-white font-medium">{movie.status}</p>
							</div>
							{mediaType === "tv" && (
								<div>
									<h4 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Network</h4>
									<p className="text-white font-medium">{movie.networks?.map((n) => n.name).join(", ") || "N/A"}</p>
								</div>
							)}
							{mediaType === "movie" && (
								<div>
									<h4 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Budget</h4>
									<p className="text-white font-medium">{movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : "N/A"}</p>
								</div>
							)}
							<div className="col-span-2 sm:col-span-2">
								<h4 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Production</h4>
								<p className="text-white font-medium line-clamp-1">{movie.production_companies?.map((c) => c.name).join(", ") || "N/A"}</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Bottom Content Area */}
			<div className="px-5 md:px-16 lg:px-24 py-10 md:py-12 flex flex-col gap-10 md:gap-12 bg-background relative z-10">
				{/* Cast Section */}
				{movie.credits?.cast?.length > 0 && (
					<section>
						<h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6 border-l-4 border-primary pl-3">Top Cast</h2>
						<div className="flex gap-3 md:gap-4 overflow-x-auto custom-scrollbar-hide pb-4 snap-x">
							{movie.credits.cast.slice(0, 15).map((person) => (
								<div key={`cast-${person.id}`} className="flex-none w-[100px] md:w-[140px] snap-start group cursor-pointer">
									<div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 mb-2 md:mb-3 shadow-lg border border-white/5">
										<img
											src={
												person.profile_path
													? `https://image.tmdb.org/t/p/w200${person.profile_path}`
													: "https://via.placeholder.com/200x300?text=No+Photo"
											}
											alt={person.name}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											loading="lazy"
										/>
									</div>
									<h4 className="text-white font-semibold text-xs md:text-sm line-clamp-1">{person.name}</h4>
									<p className="text-muted-foreground text-[10px] md:text-xs line-clamp-1 mt-0.5">{person.character}</p>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Similar Content */}
				{movie.similar?.results?.length > 0 && (
					<section>
						<h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6 border-l-4 border-primary pl-3">More Like This</h2>
						<div className="flex gap-3 md:gap-4 overflow-x-auto custom-scrollbar-hide pb-8 snap-x pt-2 -mt-2">
							{movie.similar.results.map((item, index) => (
								<div
									key={`similar-${item.id}-${index}`}
									className="flex-none w-[130px] sm:w-[160px] md:w-[220px] snap-start hover:z-10 transition-transform origin-center hover:scale-105 duration-300">
									<MovieCard movie={{ ...item, media_type: mediaType }} />
								</div>
							))}
						</div>
					</section>
				)}
			</div>

			{/* Trailer Modal Overlay */}
			<AnimatePresence>
				{showTrailer && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
						<button
							onClick={() => setShowTrailer(false)}
							className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50">
							<X className="w-6 h-6" />
						</button>

						<div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] relative group">
							{trailerKey ? (
								<iframe
									className="w-full h-full"
									src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen></iframe>
							) : (
								<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-background/80">
									<AlertCircle className="w-16 h-16 mb-4 text-destructive/50" />
									<h3 className="text-2xl font-bold text-white mb-2">Trailer Unavailable</h3>
									<p>Trailer for this content is currently unavailable.</p>
									<button
										onClick={() => setShowTrailer(false)}
										className="mt-6 px-6 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors">
										Go Back
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MediaDetails;
