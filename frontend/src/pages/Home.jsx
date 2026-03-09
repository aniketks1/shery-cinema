import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { fetchTrending } from "../services/tmdb";
import MovieCard from "../components/ui/MovieCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import { Film, Loader2 } from "lucide-react";

const Home = () => {
    const [media, setMedia] = useState([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastElementRef = useCallback((node) => {
        if (loadingInitial || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingInitial, loadingMore, hasMore]);

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            setLoadingInitial(true);
            try {
                // Fetching all trending movies and tv shows
                const data = await fetchTrending("all", "day", 1);
                setMedia(data.results);
                setHasMore(data.page < data.total_pages);
            } catch (error) {
                console.error("Failed to fetch media:", error);
            } finally {
                setLoadingInitial(false);
            }
        };

        loadInitialData();
    }, []);

    // Load More on Page Change
    useEffect(() => {
        if (page === 1) return; // Handled by initial load

        const loadMoreMedia = async () => {
            setLoadingMore(true);
            try {
                const data = await fetchTrending("all", "day", page);
                // Filter out possible duplicates
                const newItems = data.results.filter(
                    newItem => !media.some(existingItem => existingItem.id === newItem.id)
                );
                setMedia((prev) => [...prev, ...newItems]);
                setHasMore(data.page < data.total_pages);
            } catch (error) {
                console.error("Failed to fetch more media:", error);
            } finally {
                setLoadingMore(false);
            }
        };

        loadMoreMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full pb-10">
            {/* Hero Section Banner could go here later */}

            <div className="my-8 space-y-12">
                {/* Unified All Media Section - Infinite Scroll */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Film className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">All Movies & TV Shows</h2>
                        </div>
                    </div>

                    {loadingInitial ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {[...Array(15)].map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
                        </div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                        >
                            {media.map((mediaItem, index) => {
                                if (media.length === index + 1) {
                                    // Last element ref for infinite scrolling
                                    return (
                                        <motion.div ref={lastElementRef} key={`media-${mediaItem.id}-${index}`} variants={item}>
                                            <MovieCard movie={mediaItem} />
                                        </motion.div>
                                    );
                                } else {
                                    return (
                                        <motion.div key={`media-${mediaItem.id}-${index}`} variants={item}>
                                            <MovieCard movie={mediaItem} />
                                        </motion.div>
                                    );
                                }
                            })}
                        </motion.div>
                    )}

                    {/* Loader at the bottom */}
                    {loadingMore && (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
