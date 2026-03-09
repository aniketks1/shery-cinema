import { createContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { favoritesAPI } from "../services/api";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	// Map of tmdbId -> { mediaType, _id }
	const [favMap, setFavMap] = useState({});
	const [loaded, setLoaded] = useState(false);

	const loadFavorites = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			const { data } = await favoritesAPI.getFavorites();
			const map = {};
			for (const fav of data.data) {
				map[String(fav.tmdbId)] = { mediaType: fav.mediaType, _id: fav._id };
			}
			setFavMap(map);
		} catch (error) {
			if (error.response?.status === 404) {
				setFavMap({});
			}
		} finally {
			setLoaded(true);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		loadFavorites();
	}, [loadFavorites]);

	const isFavorite = useCallback((tmdbId) => !!favMap[String(tmdbId)], [favMap]);

	const toggleFavorite = useCallback(
		async (tmdbId, mediaType) => {
			const key = String(tmdbId);
			if (favMap[key]) {
				// Remove
				setFavMap((prev) => {
					const next = { ...prev };
					delete next[key];
					return next;
				});
				try {
					await favoritesAPI.removeFavorite(tmdbId);
				} catch {
					// Re-add on failure
					loadFavorites();
				}
			} else {
				// Add — optimistic update
				setFavMap((prev) => ({ ...prev, [key]: { mediaType } }));
				try {
					await favoritesAPI.addFavorite(tmdbId, mediaType);
				} catch {
					// Rollback on failure
					setFavMap((prev) => {
						const next = { ...prev };
						delete next[key];
						return next;
					});
				}
			}
		},
		[favMap, loadFavorites],
	);

	return (
		<FavoritesContext.Provider value={{ favMap, isFavorite, toggleFavorite, loaded, reload: loadFavorites }}>{children}</FavoritesContext.Provider>
	);
};
