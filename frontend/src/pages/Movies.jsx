import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Zap, Laugh, Search, Skull, Heart } from "lucide-react";
import HeroBanner from "../components/ui/HeroBanner";
import MediaCarousel from "../components/ui/MediaCarousel";
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, discoverMedia } from "../services/tmdb";

const QUICK_GENRES = [
    { id: 28, name: "Action", icon: Zap, color: "bg-orange-500/20 text-orange-500 border-orange-500/30" },
    { id: 35, name: "Comedy", icon: Laugh, color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
    { id: 27, name: "Horror", icon: Skull, color: "bg-red-500/20 text-red-500 border-red-500/30" },
    { id: 10749, name: "Romance", icon: Heart, color: "bg-pink-500/20 text-pink-500 border-pink-500/30" },
    { id: 878, name: "Sci-Fi", icon: Film, color: "bg-blue-500/20 text-blue-500 border-blue-500/30" },
];

const Movies = () => {
    const navigate = useNavigate();

    // Memoized fetch functions for the carousels to prevent infinite loops in useEffect
    const fetchTrendingMovies = useCallback(() => fetchTrending("movie", "day"), []);
    const fetchPopularObj = useCallback(() => fetchPopular(), []);
    const fetchTopRatedObj = useCallback(() => fetchTopRated(), []);
    const fetchUpcomingObj = useCallback(() => fetchUpcoming(), []);

    // Genre specific fetches
    const fetchAction = useCallback(() => discoverMedia("movie", { with_genres: '28' }), []);
    const fetchComedy = useCallback(() => discoverMedia("movie", { with_genres: '35' }), []);
    const fetchSciFi = useCallback(() => discoverMedia("movie", { with_genres: '878' }), []);

    const handleGenreClick = (genreId) => {
        navigate(`/explore`);
        // The Explore page lacks a way to consume genre from URL directly right now, 
        // but we can route there, or ideally update Explore to read `?genre=id` in future.
        // Doing this manually or via state:
        // window.location.href = `/explore`
    };

    return (
        <div className="w-full pb-20 bg-background min-h-screen">
            {/* Cinematic Hero Banner showing today's top trending movie */}
            <HeroBanner fetchFunction={fetchTrendingMovies} />



            {/* Horizontal Carousels */}
            <div className="flex flex-col gap-4">
                <MediaCarousel title="Trending Right Now" fetchFunction={fetchTrendingMovies} categoryLink="/category?type=trending&title=Trending Right Now" />
                <MediaCarousel title="Only in Theaters" fetchFunction={fetchUpcomingObj} categoryLink="/category?type=upcoming&title=Only in Theaters" />
                <MediaCarousel title="Top Rated Classics" fetchFunction={fetchTopRatedObj} categoryLink="/category?type=top_rated&title=Top Rated Classics" />
                <MediaCarousel title="Action Packed" fetchFunction={fetchAction} categoryLink="/category?type=action&title=Action Packed" />
                <MediaCarousel title="Sci-Fi Adventures" fetchFunction={fetchSciFi} categoryLink="/category?type=scifi&title=Sci-Fi Adventures" />
                <MediaCarousel title="Laugh Out Loud" fetchFunction={fetchComedy} categoryLink="/category?type=comedy&title=Laugh Out Loud" />
            </div>
        </div>
    );
};

export default Movies;
