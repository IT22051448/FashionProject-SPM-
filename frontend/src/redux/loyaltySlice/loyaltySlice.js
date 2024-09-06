// src/redux/slices/loyaltySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the loyalty slice
const initialState = {
  customers: [],
  loading: false,
  error: null,
};

// Async thunk to create a new loyalty customer
export const createLoyaltyCustomer = createAsyncThunk(
  "loyalty/createCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/loyalty/create-customer",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Loyalty slice definition
const loyaltySlice = createSlice({
  name: "loyalty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLoyaltyCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLoyaltyCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createLoyaltyCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default loyaltySlice.reducer;
