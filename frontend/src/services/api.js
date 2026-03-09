import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export const authAPI = {
	signup: (userData) => apiClient.post("/auth/register", userData),
	login: (credentials) => apiClient.post("/auth/login", credentials),
	getProfile: () => apiClient.get("/auth/me"),
	logout: () => apiClient.post("/auth/logout"),
	verifyEmail: (data) => apiClient.patch("/auth/verify-email", data),
	resendVerificationEmail: (email) => apiClient.post("/auth/resend-verification-email", { email }),
};

export const userActivityAPI = {
	addWatchHistory: (tmdbId, mediaType) => apiClient.post(`/movie/history/${tmdbId}`, { mediaType }),
	getWatchHistory: () => apiClient.get("/movie/history"),
};

export const favoritesAPI = {
	getFavorites: () => apiClient.get("/movie/favorites"),
	addFavorite: (tmdbId, mediaType) => apiClient.post(`/movie/favorite/${tmdbId}`, { mediaType }),
	removeFavorite: (tmdbId) => apiClient.delete(`/movie/favorite/${tmdbId}`),
};

export const adminAPI = {
	// Movies
	getMovies: (page = 1, limit = 20) => apiClient.get(`/admin/movie?page=${page}&limit=${limit}`),
	createMovie: (formData) =>
		apiClient.post("/admin/movie", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	deleteMovie: (movieId) => apiClient.delete(`/admin/movie/${movieId}`),
	// Users
	getUsers: (page = 1, limit = 20) => apiClient.get(`/admin/user?page=${page}&limit=${limit}`),
	updateUser: (userId, data) => apiClient.patch(`/admin/user/${userId}`, data),
	deleteUser: (userId) => apiClient.delete(`/admin/user/${userId}`),
};

export default apiClient;
