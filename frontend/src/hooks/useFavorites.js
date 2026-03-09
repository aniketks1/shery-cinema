import { useContext } from "react";
import { FavoritesContext } from "../store/FavoritesContext";

export const useFavorites = () => useContext(FavoritesContext);
