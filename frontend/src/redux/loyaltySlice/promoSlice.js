import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the promo codes slice
const initialState = {
  promoCodes: [],
  promoCode: null,
  loading: false,
  error: null,
};

// Async thunk to create a new promo code
export const createPromoCode = createAsyncThunk(
  "promo/createPromoCode",
  async (promoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/loyalty/promo-codes",
        promoData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch all promo codes
export const fetchPromoCodes = createAsyncThunk(
  "promo/fetchPromoCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/loyalty/promo-codes"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch a promo code by ID
export const fetchPromoCodeById = createAsyncThunk(
  "promo/fetchPromoCodeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/loyalty/promocodes/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a promo code
export const updatePromoCode = createAsyncThunk(
  "promo/updatePromoCode",
  async ({ id, promoData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/loyalty/promocodes/${id}`,
        promoData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a promo code
export const deletePromoCode = createAsyncThunk(
  "promo/deletePromoCode",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/loyalty/promo-codes/${id}`);
      return id; // Return the id to remove it from the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Promo codes slice definition
const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes.push(action.payload);
      })
      .addCase(createPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes = action.payload;
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPromoCodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload;
      })
      .addCase(fetchPromoCodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload;
      })
      .addCase(updatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deletePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes = state.promoCodes.filter(
          (promo) => promo._id !== action.payload
        );
      })
      .addCase(deletePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default promoSlice.reducer;
