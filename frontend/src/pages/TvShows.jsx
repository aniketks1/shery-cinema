import { useCallback } from "react";
import HeroBanner from "../components/ui/HeroBanner";
import MediaCarousel from "../components/ui/MediaCarousel";
import { fetchTrending, fetchPopularTv, fetchTopRatedTv, fetchOnTheAirTv, discoverMedia } from "../services/tmdb";

const TvShows = () => {
    // Memoized fetch functions for the carousels to prevent infinite loops in useEffect
    const fetchTrendingTv = useCallback(() => fetchTrending("tv", "day"), []);
    const fetchPopularTvObj = useCallback(() => fetchPopularTv(), []);
    const fetchTopRatedTvObj = useCallback(() => fetchTopRatedTv(), []);
    const fetchOnTheAirTvObj = useCallback(() => fetchOnTheAirTv(), []);

    // Genre specific fetches for TV
    const fetchActionAdventureTv = useCallback(() => discoverMedia("tv", { with_genres: '10759' }), []);
    const fetchComedyTv = useCallback(() => discoverMedia("tv", { with_genres: '35' }), []);
    const fetchSciFiFantasyTv = useCallback(() => discoverMedia("tv", { with_genres: '10765' }), []);

    return (
        <div className="w-full pb-20 bg-background min-h-screen">
            {/* Cinematic Hero Banner showing today's top trending TV show */}
            <HeroBanner fetchFunction={fetchTrendingTv} />

            {/* Horizontal Carousels */}
            <div className="flex flex-col gap-4">
                <MediaCarousel title="Trending Right Now" fetchFunction={fetchTrendingTv} mediaType="tv" categoryLink="/category?type=tv_trending&title=Trending TV Shows" />
                <MediaCarousel title="Popular Shows" fetchFunction={fetchPopularTvObj} mediaType="tv" categoryLink="/category?type=tv_popular&title=Popular TV Shows" />
                <MediaCarousel title="Currently Airing" fetchFunction={fetchOnTheAirTvObj} mediaType="tv" categoryLink="/category?type=tv_on_the_air&title=Currently Airing" />
                <MediaCarousel title="Top Rated Masterpieces" fetchFunction={fetchTopRatedTvObj} mediaType="tv" categoryLink="/category?type=tv_top_rated&title=Top Rated TV Shows" />
                <MediaCarousel title="Action & Adventure" fetchFunction={fetchActionAdventureTv} mediaType="tv" categoryLink="/category?type=tv_action_adventure&title=Action & Adventure TV" />
                <MediaCarousel title="Sci-Fi & Fantasy" fetchFunction={fetchSciFiFantasyTv} mediaType="tv" categoryLink="/category?type=tv_scifi_fantasy&title=Sci-Fi & Fantasy TV" />
                <MediaCarousel title="Comedy Series" fetchFunction={fetchComedyTv} mediaType="tv" categoryLink="/category?type=tv_comedy&title=Comedy TV Shows" />
            </div>
        </div>
    );
};

export default TvShows;
