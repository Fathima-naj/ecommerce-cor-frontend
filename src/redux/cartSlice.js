
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosInstance";

// Get the logged-in user's cart
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/cart");
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

// Add a product to the cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/cart/add", {
                productId,
                quantity,
            });

            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add product"
            );
        }
    }
);

// Increase quantity
export const incrementQuantity = createAsyncThunk(
    "cart/incrementQuantity",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `/cart/increment/${productId}`
            );

            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to increase quantity"
            );
        }
    }
);

// Decrease quantity
export const decrementQuantity = createAsyncThunk(
    "cart/decrementQuantity",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `/cart/decrement/${productId}`
            );

            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to decrease quantity"
            );
        }
    }
);

// Remove one product
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `/cart/${productId}`
            );

            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove product"
            );
        }
    }
);

// Clear the entire cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/cart/clear");
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear cart"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cart: null,
        loading: false,
        error: null,
    },

    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        resetCart: (state) => {
            state.cart = null;
            state.error = null;
            state.loading = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(incrementQuantity.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(incrementQuantity.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(decrementQuantity.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(decrementQuantity.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(clearCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearCartError, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
