import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  isLoading: false,
  stockList: [],
};

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

export const fetchAllStock = createAsyncThunk(
  "adminStock/fetchAllStock",
  async () => {
    const result = await axios.get(
      "http://localhost:3000/api/stock/fetch-stock"
    );
    return result?.data;
  }
);

// Create the slice
const adminStockSlice = createSlice({
  name: "adminStock",
  initialState, 
  reducers: {}, // No synchronous reducers for now
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStock.fulfilled, (state, action) => {
        console.log(action.payload);

        state.isLoading = false;
        state.stockList = action.payload;
      })
      .addCase(fetchAllStock.rejected, (state) => {
        state.isLoading = false;
        state.stockList = [];
      });
  },
});

export default adminStockSlice.reducer;
