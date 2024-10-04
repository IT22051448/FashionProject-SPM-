import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  token: null,
  isLoading: false,
  error: null,
  message: null, // For success messages
  stockOrders: [], // Added to hold fetched stock orders
};

// Async thunk for validating a token
export const validateToken = createAsyncThunk(
  "token/validateToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}supplierToken/validate-token/${token}`
      );
      return response.data; // Return valid token data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async thunk for fetching stock orders
export const fetchStockOrders = createAsyncThunk(
  "adminStock/fetchStockOrders",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}supplierToken/fetch-stock-orders`
    );
    return result?.data;
  }
);

// Async thunk for updating token status
export const updateTokenStatus = createAsyncThunk(
  "token/updateTokenStatus",
  async ({ tokenId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }supplierToken/update-token-status/${tokenId}`,
        { status }
      );
      return response.data; // Return the success message
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Create the token slice
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle validateToken
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle fetchStockOrders
      .addCase(fetchStockOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockOrders = action.payload.orders; // Store the orders in state
      })
      .addCase(fetchStockOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle updateTokenStatus
      .addCase(updateTokenStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTokenStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message; // Store the success message
      })
      .addCase(updateTokenStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
