import axios from "axios";

// Fallback logic, but the actual key should come from .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "dummy_key";
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export const fetchTrending = async (mediaType = "all", timeWindow = "day", page = 1) => {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } });
    return response.data;
};

export const fetchPopular = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/popular`, { params: { page } });
    return response.data;
};

export const fetchTopRated = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/top_rated`, { params: { page } });
    return response.data;
};

export const fetchUpcoming = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/upcoming`, { params: { page } });
    return response.data;
};

// --- TV Show Specific Endpoints ---

export const fetchPopularTv = async (page = 1) => {
    const response = await tmdbApi.get(`/tv/popular`, { params: { page } });
    return response.data;
};

export const fetchTopRatedTv = async (page = 1) => {
    const response = await tmdbApi.get(`/tv/top_rated`, { params: { page } });
    return response.data;
};

export const fetchOnTheAirTv = async (page = 1) => {
    const response = await tmdbApi.get(`/tv/on_the_air`, { params: { page } });
    return response.data;
};

export const searchContent = async (query, page = 1) => {
    const response = await tmdbApi.get(`/search/multi`, { params: { query, page } });
    return response.data;
};

export const fetchMovieDetails = async (id) => {
    const response = await tmdbApi.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits,similar' } });
    return response.data;
};

export const fetchTvDetails = async (id) => {
    const response = await tmdbApi.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits,similar' } });
    return response.data;
};

export const getGenres = async (mediaType = "movie") => {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`);
    return response.data;
};

export const discoverMedia = async (mediaType = "movie", params = {}) => {
    const response = await tmdbApi.get(`/discover/${mediaType}`, { params });
    return response.data;
};

export default tmdbApi;
