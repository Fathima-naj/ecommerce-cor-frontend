
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosInstance";

// Fetch the logged-in user's wishlist
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/wishlist");
            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

// Add a product
export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/wishlist/add", {
                productId,
            });

            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add product"
            );
        }
    }
);

// Remove a product
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `/wishlist/${productId}`
            );

            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove product"
            );
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        wishlist: null,
        loading: false,
        error: null,
    },

    reducers: {
        resetWishlist: (state) => {
            state.wishlist = null;
            state.loading = false;
            state.error = null;
        },
        clearWishlistError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetWishlist, clearWishlistError } =
    wishlistSlice.actions;

export default wishlistSlice.reducer;
