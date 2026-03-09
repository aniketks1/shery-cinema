import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            // Assuming response structure is { success: true, token, user }
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return { token, user };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to log in. Please check your credentials.'
            );
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.signup(userData);
            // The backend responds with a success message instead of a token
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create account. Please try again later.'
            );
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.getProfile();
            return response.data.user;
        } catch (error) {
            // If profile fetch fails, token is likely expired/invalid
            localStorage.removeItem('token');
            return rejectWithValue(
                error.response?.data?.message || 'Session expired. Please log in again.'
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Backend logout failed:", error);
        } finally {
            dispatch(logout());
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    signupSuccess: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.error = null;
        },
        resetSignupSuccess: (state) => {
            state.signupSuccess = false;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Signup
        builder.addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.signupSuccess = false;
        });
        builder.addCase(signupUser.fulfilled, (state) => {
            state.loading = false;
            state.signupSuccess = true;
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.signupSuccess = false;
            state.error = action.payload;
        });

        // Fetch Profile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
