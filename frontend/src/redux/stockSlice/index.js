import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  stockList: [],
  lowStockList: [],
};

// Thunk to add new stock
export const addNewStock = createAsyncThunk(
  "adminStock/addNewStock",
  async (formData) => {
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
  }
);

// Thunk to fetch all stock
export const fetchAllStock = createAsyncThunk(
  "adminStock/fetchAllStock",
  async () => {
    const result = await axios.get(
      "http://localhost:3000/api/stock/fetch-stock"
    );
    return result?.data;
  }
);

// Thunk to fetch low stock
export const fetchLowStock = createAsyncThunk(
  "adminStock/fetchLowStock",
  async () => {
    const result = await axios.get("http://localhost:3000/api/stock/fetch-low");
    return result?.data;
  }
);

// Thunk to delete stock
export const deleteStock = createAsyncThunk(
  "adminStock/deleteStock",
  async (stockId) => {
    const result = await axios.delete(
      `http://localhost:3000/api/stock/delete-stock/${stockId}`
    );
    return stockId; // Return the stock ID that was deleted
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
      })
      .addCase(fetchAllStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockList = action.payload;
      })
      .addCase(fetchAllStock.rejected, (state) => {
        state.isLoading = false;
        state.stockList = [];
      })

      // Fetch low stock
      .addCase(fetchLowStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lowStockList = action.payload;
        console.log(action.payload); 
      })
      .addCase(fetchLowStock.rejected, (state) => {
        state.isLoading = false;
        state.lowStockList = [];
      })

      // Delete stock
      .addCase(deleteStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted stock from the stock list
        state.stockList = state.stockList.filter(
          (stock) => stock._id !== action.payload
        );
      })
      .addCase(deleteStock.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminStockSlice.reducer;
