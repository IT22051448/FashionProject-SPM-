// src/redux/slices/loyaltySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the loyalty slice
const initialState = {
  customers: [],
  promoCodes: [],
  customer: null,
  loading: false,
  error: null,
  referralStatus: null,
};

// Async thunk to create a new loyalty customer
export const createLoyaltyCustomer = createAsyncThunk(
  "loyalty/createCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/loyalty/create-customer",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to check if a user is a loyalty customer
export const checkLoyaltyCustomer = createAsyncThunk(
  "loyalty/checkCustomer",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/loyalty/check-customer",
        { email }
      );
      return response.data.exists;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to handle referral
export const referAFriend = createAsyncThunk(
  "loyalty/referAFriend",
  async ({ referrerEmail, referredEmail }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/referral/refer",
        { referrerEmail, referredEmail }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch customer details
export const fetchCustomerDetails = createAsyncThunk(
  "loyalty/fetchCustomerDetails",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/loyalty/customer/${email}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch promo codes
export const fetchPromoCodes = createAsyncThunk(
  "loyalty/fetchPromoCodes",
  async (tier, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/loyalty/promo-codes/${tier}`
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
      })
      .addCase(checkLoyaltyCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLoyaltyCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoyaltyCustomer = action.payload;
      })
      .addCase(checkLoyaltyCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(referAFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.referralStatus = null;
      })
      .addCase(referAFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.referralStatus = "success";
      })
      .addCase(referAFriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.referralStatus = "failed";
      })
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.customer = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.promoCodes = [];
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes = action.payload;
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default loyaltySlice.reducer;
