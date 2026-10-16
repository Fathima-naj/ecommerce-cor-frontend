
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosInstance";

const initialState = {
    user: null,
    loading: false,
    profileLoading: true,
    profileChecked: false,
    error: null,
};

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

// Register
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/user/register",
                user
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Registration failed")
            );
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/user/login",
                credentials
            );
            return response.data.user;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Login failed")
            );
        }
    }
);

// Fetch current user
export const getProfile = createAsyncThunk(
    "user/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/profile");
            return response.data.user;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to fetch profile")
            );
        }
    }
);

// Logout through the backend
export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/user/logout");
            return true;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Logout request failed")
            );
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.profileLoading = false;
            state.profileChecked = true;
        },
    },

    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.profileLoading = false;
                state.profileChecked = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.user = null;
                state.profileLoading = false;
                state.profileChecked = true;
            })

            // Initial profile check
            .addCase(getProfile.pending, (state) => {
                state.profileLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profileChecked = true;
                state.user = action.payload;
            })
            .addCase(getProfile.rejected, (state) => {
                state.profileLoading = false;
                state.profileChecked = true;
                state.user = null;
            })

            // Logout
            // .addCase(logoutUser.fulfilled, (state) => {
            //     state.user = null;
            //     state.error = null;
            //     state.profileLoading = false;
            //     state.profileChecked = true;
            // })
            // .addCase(logoutUser.rejected, (state) => {
            //     // Clear local state even if the logout request fails.
            //     state.user = null;
            //     state.error = null;
            //     state.profileLoading = false;
            //     state.profileChecked = true;
            // });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
