import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../api/axiosInstance"

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null
}

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback

export const getProduct = createAsyncThunk(
    "product/getProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/product/")
            console.log(response.data.products)
            return response.data.products
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to load products"))
        }
    }
)

export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (product, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/product/add", product)
            return response.data.newProduct
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to add product"))
        }
    }
)

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/product/${id}`)
            return response.data?.product || response.data || null
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to load product"))
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/product/delete/${id}`)
            return id
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to delete product"))
        }
    }
)

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, product }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/product/update/${id}`, product)
            return response.data.updatedProduct
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to update product"))
        }
    }
)

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(getProductById.pending, (state) => {
                state.loading = true
                state.error = null
                state.product = null
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false
                state.product = action.payload
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                )
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                )
                if (index !== -1) state.products[index] = action.payload
                if (state.product?._id === action.payload._id) {
                    state.product = action.payload
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
})

export default productSlice.reducer
