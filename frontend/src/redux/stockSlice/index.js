import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  stockList: [],
  lowStockList: [],
  error: null, // Add error state for better error handling
};

// Thunk to add new stock
export const addNewStock = createAsyncThunk(
  "adminStock/addNewStock",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        "http://localhost:3000/api/stock/add-stock",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding stock");
    }
  }
);

// Thunk to fetch all stock
export const fetchAllStock = createAsyncThunk(
  "adminStock/fetchAllStock",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/stock/fetch-stock"
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching stock");
    }
  }
);

// Thunk to fetch low stock
export const fetchLowStock = createAsyncThunk(
  "adminStock/fetchLowStock",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/stock/fetch-low"
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching low stock"
      );
    }
  }
);

// Thunk to delete stock
export const deleteStock = createAsyncThunk(
  "adminStock/deleteStock",
  async (stockId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/stock/delete-stock/${stockId}`
      );
      return stockId; // Return the stock ID that was deleted
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting stock");
    }
  }
);

// Create the slice
const adminStockSlice = createSlice({
  name: "adminStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all stock
      .addCase(fetchAllStock.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error
      })
      .addCase(fetchAllStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockList = action.payload;
      })
      .addCase(fetchAllStock.rejected, (state, action) => {
        state.isLoading = false;
        state.stockList = [];
        state.error = action.payload; // Store the error message
      })

      // Fetch low stock
      .addCase(fetchLowStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lowStockList = action.payload;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.isLoading = false;
        state.lowStockList = [];
        state.error = action.payload;
      })

      // Delete stock
      .addCase(deleteStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(deleteStock.fulfilled, (state, action) => {
        state.isLoading = false;

        if (state.stockList?.stocks) {
          state.stockList.stocks = state.stockList.stocks.filter(
            (stock) => stock._id !== action.payload
          );
        }
      })
      .addCase(deleteStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default adminStockSlice.reducer;
