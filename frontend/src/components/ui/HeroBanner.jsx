import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";

// Fallback image url builder
const getImageUrl = (path, size = "original") => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const HeroBanner = ({ fetchFunction }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeaturedMovie = async () => {
            try {
                const data = await fetchFunction();
                if (data && data.results && data.results.length > 0) {
                    // Pick a random movie from the top 5 trending to keep it fresh
                    const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
                    setMovie(data.results[randomIndex]);
                }
            } catch (error) {
                console.error("Failed to fetch hero featured movie", error);
            } finally {
                setLoading(false);
            }
        };

        getFeaturedMovie();
    }, [fetchFunction]);

    if (loading) {
        return (
            <div className="w-full h-[60vh] md:h-[80vh] bg-muted/20 animate-pulse rounded-b-3xl"></div>
        );
    }

    if (!movie) return null;

    const backdropUrl = getImageUrl(movie.backdrop_path, "original");

    return (
        <div className="relative w-full h-[60vh] md:h-[85vh] -mt-20"> {/* Negative margin to naturally sit behind the fixed transparent navbar */}
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            >
                {/* Gradient Overlays for readability and fading into background */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-8 md:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-4 leading-tight drop-shadow-2xl line-clamp-2 md:line-clamp-none">
                        {movie.title || movie.name}
                    </h1>

                    <div className="flex items-center gap-4 text-sm md:text-base text-white/80 mb-6 font-medium">
                        {movie.vote_average && (
                            <span className="flex items-center gap-1 text-yellow-500">
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                        )}
                        {movie.release_date && (
                            <span>{movie.release_date.split('-')[0]}</span>
                        )}
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">
                            {(movie.original_language || "en").toUpperCase()}
                        </span>
                    </div>

                    <p className="text-white/80 text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl text-shadow-sm">
                        {movie.overview}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to={`/${movie.media_type || 'movie'}/${movie.id}`}
                            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-colors"
                        >
                            <Play className="w-5 h-5 fill-black" />
                            Play Trailer
                        </Link>
                        <Link
                            to={`/${movie.media_type || 'movie'}/${movie.id}`}
                            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-bold backdrop-blur-md transition-colors border border-white/10"
                        >
                            <Info className="w-5 h-5" />
                            More Info
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroBanner;
