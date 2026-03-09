import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

const MediaCarousel = ({ title, fetchFunction, mediaType = "movie", categoryLink }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await fetchFunction();
                if (data && data.results) {
                    setItems(data.results.filter(item => item.poster_path || item.backdrop_path));
                }
            } catch (error) {
                console.error(`Failed to fetch content for carousel: ${title}`, error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [fetchFunction, title]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!loading && items.length === 0) return null;

    return (
        <div className="w-full my-8 relative group">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 mb-2 md:mb-4 gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-shrink min-w-0">
                    <div className="w-1 md:w-1.5 h-5 md:h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] flex-shrink-0"></div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-md truncate">
                        {title}
                    </h2>
                </div>
                {categoryLink && (
                    <Link
                        to={categoryLink}
                        className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm lg:text-base text-primary/80 hover:text-primary transition-colors font-medium border border-primary/20 hover:border-primary/50 px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full bg-primary/5 backdrop-blur-sm whitespace-nowrap flex-shrink-0"
                    >
                        View All
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                )}
            </div>

            {/* Carousel Interactive Area */}
            {/* Carousel Interactive Area */}
            <div className="relative group/carousel">
                {/* Left Scroll Gradient & Button - Fixed pointer events */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-start px-2 md:px-6 pointer-events-none">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1 md:p-2 bg-black/40 hover:bg-black/80 hover:text-primary backdrop-blur-md text-white rounded-full transition-all duration-300 transform hover:scale-125 border border-white/10 pointer-events-auto disabled:opacity-0"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 pointer-events-none" />
                    </button>
                </div>

                {/* Carousel Container */}
                <div
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto custom-scrollbar-hide snap-x snap-mandatory px-6 md:px-16 lg:px-24 pb-8 pt-4 -mt-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        // Skeleton Loading State
                        [...Array(6)].map((_, i) => (
                            <div key={`skel-car-${title}-${i}`} className="flex-none w-[140px] sm:w-[200px] md:w-[220px] lg:w-[250px] snap-start">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        // Actual Content
                        items.map((item, index) => (
                            <div key={`car-${item.id}-${index}`} className="flex-none w-[140px] sm:w-[200px] md:w-[220px] lg:w-[250px] snap-start hover:z-10 transition-transform origin-center hover:scale-105 duration-300">
                                <MovieCard movie={{ ...item, media_type: mediaType }} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Scroll Gradient & Button - Fixed pointer events */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-end px-2 md:px-6 pointer-events-none">
                    <button
                        onClick={() => scroll('right')}
                        className="p-1 md:p-2 bg-black/40 hover:bg-black/80 hover:text-primary backdrop-blur-md text-white rounded-full transition-all duration-300 transform hover:scale-125 border border-white/10 pointer-events-auto disabled:opacity-0"
                    >
                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10 pointer-events-none" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaCarousel;
