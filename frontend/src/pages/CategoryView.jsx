import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchTrending, fetchTopRated, fetchUpcoming, discoverMedia, fetchPopularTv, fetchTopRatedTv, fetchOnTheAirTv } from "../services/tmdb";
import MovieCard from "../components/ui/MovieCard";
import SkeletonCard from "../components/ui/SkeletonCard";

const CategoryView = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const type = searchParams.get("type");
    const title = searchParams.get("title") || "Movies";

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Infinite Scroll Ref
    const observer = useRef();
    const lastElementRef = useCallback((node) => {
        if (loadingInitial || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingInitial, loadingMore, hasMore]);

    useEffect(() => {
        const fetchContent = async () => {
            if (page === 1) setLoadingInitial(true);
            else setLoadingMore(true);

            try {
                let data;
                let explicitMediaType = 'movie'; // Default to movie for formatting

                switch (type) {
                    // Movie Cases
                    case "trending":
                        data = await fetchTrending("movie", "day", page);
                        break;
                    case "top_rated":
                        data = await fetchTopRated(page);
                        break;
                    case "upcoming":
                        data = await fetchUpcoming(page);
                        break;
                    case "action":
                        data = await discoverMedia("movie", { with_genres: '28', page });
                        break;
                    case "comedy":
                        data = await discoverMedia("movie", { with_genres: '35', page });
                        break;
                    case "scifi":
                        data = await discoverMedia("movie", { with_genres: '878', page });
                        break;

                    // TV Show Cases
                    case "tv_trending":
                        data = await fetchTrending("tv", "day", page);
                        explicitMediaType = 'tv';
                        break;
                    case "tv_popular":
                        data = await fetchPopularTv(page);
                        explicitMediaType = 'tv';
                        break;
                    case "tv_top_rated":
                        data = await fetchTopRatedTv(page);
                        explicitMediaType = 'tv';
                        break;
                    case "tv_on_the_air":
                        data = await fetchOnTheAirTv(page);
                        explicitMediaType = 'tv';
                        break;
                    case "tv_action_adventure":
                        data = await discoverMedia("tv", { with_genres: '10759', page }); // TV Action & Adventure
                        explicitMediaType = 'tv';
                        break;
                    case "tv_comedy":
                        data = await discoverMedia("tv", { with_genres: '35', page });
                        explicitMediaType = 'tv';
                        break;
                    case "tv_scifi_fantasy":
                        data = await discoverMedia("tv", { with_genres: '10765', page }); // TV Sci-Fi & Fantasy
                        explicitMediaType = 'tv';
                        break;

                    default:
                        // Fallback to popular movies
                        data = await discoverMedia("movie", { page });
                }

                if (data && data.results) {
                    // Filter out items without images
                    const validItems = data.results.filter(item => item.poster_path || item.backdrop_path).map(item => ({ ...item, media_type: item.media_type || explicitMediaType }));

                    if (page === 1) {
                        setResults(validItems);
                    } else {
                        setResults((prev) => {
                            const newItems = validItems.filter(
                                newItem => !prev.some(existing => existing.id === newItem.id)
                            );
                            return [...prev, ...newItems];
                        });
                    }
                    setHasMore(data.page < data.total_pages);
                }
            } catch (error) {
                console.error("Failed to fetch category content", error);
            } finally {
                setLoadingInitial(false);
                setLoadingMore(false);
            }
        };

        if (type) {
            fetchContent();
        }
    }, [type, page]);

    const containerVariant = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full pb-10 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {title}
                    </h1>
                </div>
            </div>

            {loadingInitial ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(15)].map((_, i) => <SkeletonCard key={`skel-cat-${i}`} />)}
                </div>
            ) : (
                <motion.div
                    variants={containerVariant}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                >
                    {results.map((item, index) => {
                        if (results.length === index + 1) {
                            return (
                                <motion.div ref={lastElementRef} key={`cat-${item.id}-${index}`} variants={itemVariant}>
                                    <MovieCard movie={{ ...item, media_type: 'movie' }} />
                                </motion.div>
                            );
                        } else {
                            return (
                                <motion.div key={`cat-${item.id}-${index}`} variants={itemVariant}>
                                    <MovieCard movie={{ ...item, media_type: 'movie' }} />
                                </motion.div>
                            );
                        }
                    })}
                </motion.div>
            )}

            {loadingMore && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {!hasMore && results.length > 0 && !loadingMore && !loadingInitial && (
                <div className="text-center py-10 text-muted-foreground/50 font-medium">
                    You've reached the end of the collection.
                </div>
            )}
        </div>
    );
};

export default CategoryView;
