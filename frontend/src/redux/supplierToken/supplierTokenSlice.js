import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  token: null,
  isLoading: false,
  error: null,
};

export const validateToken = createAsyncThunk(
  "token/validateToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/supplierToken/validate-token/${token}`
      );
      return response.data; // Return valid token data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

export const fetchStockOrders = createAsyncThunk(
  "adminStock/fetchStockOrders",
  async () => {
    const result = await axios.get(
      "http://localhost:3000/api/supplierToken/fetch-stock-orders"
    );
    return result?.data;
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
      });
  },
});
// Export actions and reducer
export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
