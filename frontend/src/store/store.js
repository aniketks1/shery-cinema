import { configureStore } from '@reduxjs/toolkit';
import authReducer, { fetchUserProfile } from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Hydrate user profile on startup if token exists
const token = localStorage.getItem('token');
if (token) {
    store.dispatch(fetchUserProfile());
}
