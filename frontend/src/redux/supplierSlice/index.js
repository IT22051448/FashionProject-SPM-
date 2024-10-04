import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  supplierList: [],
};

export const fetchAllSuppliers = createAsyncThunk(
  "adminSupplier/fetchAllSuppliers",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}supplier/get-supplier`
    );
    console.log("API Response:", result.data); // Log API response for debugging
    return result.data.stocks; // Adjust based on actual API response
  }
);

const supplierSlice = createSlice({
  name: "adminSupplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supplierList = action.payload;
        console.log("Supplier List:", action.payload); // Log supplier list
      })
      .addCase(fetchAllSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.supplierList = [];
      });
  },
});

export default supplierSlice.reducer;
