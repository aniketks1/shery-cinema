import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2, Filter, X } from "lucide-react";
import { discoverMedia, searchContent, getGenres } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import MovieCard from "../components/ui/MovieCard";
import SkeletonCard from "../components/ui/SkeletonCard";

const Explore = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryFromUrl = searchParams.get("q") || "";

    const [mediaType, setMediaType] = useState("movie"); // "movie", "tv", "all" (all is for search only currently)
    const debouncedSearch = useDebounce(queryFromUrl, 700);

    // Filters & Sorting
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortBy, setSortBy] = useState("popularity.desc");

    // Results & Pagination
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

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

    // Load Genres (when mediaType changes between 'movie' and 'tv')
    useEffect(() => {
        if (mediaType === "all") return; // "all" doesn't have a unified genres list in TMDB
        const loadGenres = async () => {
            try {
                const data = await getGenres(mediaType);
                setGenres(data.genres || []);
            } catch (error) {
                console.error("Failed to load genres", error);
            }
        };
        loadGenres();
        // Reset selected genre when switching media types as genre IDs differ
        setSelectedGenre("");
    }, [mediaType]);

    // Fetch Content Logic
    useEffect(() => {
        const fetchContent = async () => {
            if (page === 1) setLoadingInitial(true);
            else setLoadingMore(true);

            try {
                let data;

                // If there's a search query, use search endpoint
                if (debouncedSearch.trim() !== "") {
                    // The multi-search endpoint returns movies, tv and people.
                    // It doesn't neatly support all the discover filters, so we ignore filters during explicit search.
                    data = await searchContent(debouncedSearch, page);
                    // Filter out people results as we only have MovieCard mapping
                    data.results = data.results.filter(item => item.media_type === "movie" || item.media_type === "tv");
                } else {
                    // Normal Discover mode with filters
                    const params = {
                        page,
                        sort_by: sortBy,
                        ...(selectedGenre && { with_genres: selectedGenre }),
                    };
                    // Treat 'all' as movie for discover if no search is active fallback
                    const typeToFetch = mediaType === "all" ? "movie" : mediaType;
                    data = await discoverMedia(typeToFetch, params);
                }

                if (page === 1) {
                    setResults(data.results);
                } else {
                    setResults((prev) => {
                        // Avoid duplicates
                        const newItems = data.results.filter(
                            newItem => !prev.some(existing => existing.id === newItem.id)
                        );
                        return [...prev, ...newItems];
                    });
                }
                setHasMore(data.page < data.total_pages);
            } catch (error) {
                console.error("Failed to fetch explore content", error);
            } finally {
                setLoadingInitial(false);
                setLoadingMore(false);
            }
        };

        fetchContent();
    }, [mediaType, debouncedSearch, selectedGenre, sortBy, page]);

    // Reset page to 1 whenever a filter/search changes
    useEffect(() => {
        setPage(1);
    }, [mediaType, debouncedSearch, selectedGenre, sortBy]);

    // Reset filters when a search query is initiated
    useEffect(() => {
        if (queryFromUrl) {
            setMediaType("all"); // The user mentioned search finds "all, movies, and tv-shows"
            setSelectedGenre("");
            setSortBy("popularity.desc");
        } else {
            // Revert mediaType to 'movie' if it was 'all' when searching and now we're back in discover
            if (mediaType === "all") setMediaType("movie");
        }
    }, [queryFromUrl]);

    const handleClearFilters = () => {
        setSelectedGenre("");
        setMediaType("movie");
        if (queryFromUrl) {
            navigate("/explore");
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full pb-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {queryFromUrl ? `Search Results for "${queryFromUrl}"` : "Explore"}
                </h1>
            </div>

            {/* Hide Filter Button and Filters Bar when User is explicitly searching */}
            {!queryFromUrl && (
                <>
                    {/* Filter Toggle Button (Mobile) */}
                    <button
                        className="md:hidden flex items-center gap-2 mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>

                    {/* Filters Bar */}
                    <div className={`md:flex flex-col lg:flex-row gap-4 lg:items-center mb-8 p-4 rounded-2xl bg-muted/20 border border-border/50 backdrop-blur-sm ${showFilters ? 'flex' : 'hidden'}`}>
                        {/* Media Type Tabs */}
                        <div className="flex bg-background/80 p-1 rounded-xl w-fit border border-border/50">
                            <button
                                onClick={() => setMediaType("all")}
                                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${mediaType === "all" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setMediaType("movie")}
                                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${mediaType === "movie" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"}`}
                            >
                                Movies
                            </button>
                            <button
                                onClick={() => setMediaType("tv")}
                                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${mediaType === "tv" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"}`}
                            >
                                TV Shows
                            </button>
                        </div>

                        <div className="w-px h-8 bg-border hidden lg:block mx-2"></div>

                        {/* Additional Filters (Hidden when searching globally or when media type is 'all' since TMDB handles it differently) */}
                        {debouncedSearch === "" && mediaType !== "all" && (
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="bg-background/80 border border-border/50 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px] custom-select"
                                >
                                    <option value="">All Genres</option>
                                    {genres.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-background/80 border border-border/50 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 min-w-[160px] custom-select"
                                >
                                    <option value="popularity.desc">Most Popular</option>
                                    <option value="vote_average.desc">Highest Rated</option>
                                    <option value="primary_release_date.desc">Newest Releases</option>
                                    <option value="primary_release_date.asc">Oldest Releases</option>
                                    <option value="title.asc">Alphabetical A-Z</option>
                                </select>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Results Grid */}
            {loadingInitial ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(15)].map((_, i) => <SkeletonCard key={`skel-expl-${i}`} />)}
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Search className="w-16 h-16 mb-4 text-muted-foreground/30" />
                    <h3 className="text-2xl font-semibold text-white mb-2">No results found</h3>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                    <button
                        onClick={handleClearFilters}
                        className="mt-6 px-6 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                >
                    {results.map((item, index) => {
                        if (results.length === index + 1) {
                            return (
                                <motion.div ref={lastElementRef} key={`expl-${item.id}-${index}`} variants={itemVariant}>
                                    <MovieCard movie={item} />
                                </motion.div>
                            );
                        } else {
                            return (
                                <motion.div key={`expl-${item.id}-${index}`} variants={itemVariant}>
                                    <MovieCard movie={item} />
                                </motion.div>
                            );
                        }
                    })}
                </motion.div>
            )}

            {/* Spinner for loading more pages */}
            {loadingMore && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* End of results indicator */}
            {!hasMore && results.length > 0 && !loadingMore && !loadingInitial && (
                <div className="text-center py-10 text-muted-foreground/50 font-medium">
                    You've reached the end of the cinematic universe.
                </div>
            )}
        </div>
    );
};

export default Explore;
