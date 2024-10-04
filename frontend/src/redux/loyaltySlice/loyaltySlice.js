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
  pointsAdded: false,
};

// Async thunk to create a new loyalty customer
export const createLoyaltyCustomer = createAsyncThunk(
  "loyalty/createCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}loyalty/create-customer`,
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
        "http://localhost:5000/api/loyalty/check-customer",
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
        "http://localhost:5000/api/referral/refer",
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
        `http://localhost:5000/api/loyalty/customer/${email}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for updating customer details
export const updateCustomerDetails = createAsyncThunk(
  "loyalty/updateCustomerDetails",
  async ({ email, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}loyalty/update-customer/${email}`,
        updates
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to fetch promo codes
export const fetchPromoCodes = createAsyncThunk(
  "loyalty/fetchPromoCodes",
  async (tier, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/loyalty/promo-codes/${tier}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating customer tier
export const updateCustomerTier = createAsyncThunk(
  "loyalty/updateCustomerTier",
  async ({ email, newTier }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}loyalty/${email}/tier`,
        {
          tier: newTier,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Loyalty slice definition
const loyaltySlice = createSlice({
  name: "loyalty",
  initialState: {
    points: 0,
    tier: "",
  },

  reducers: {
    updateLoyaltyPointsSuccess(state) {
      state.pointsAdded = true;
    },
    resetPointsAdded(state) {
      state.pointsAdded = false;
    },
  },
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
      })
      .addCase(updateLoyaltyPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
        state.points = action.payload.points;
        state.tier = action.payload.tier;
      })
      .addCase(updateLoyaltyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(updateCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer.email !== action.payload.email
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCustomerTier.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerTier.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCustomer = action.payload;
        const index = state.customers.findIndex(
          (customer) => customer.email === updatedCustomer.email
        );
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
      })
      .addCase(updateCustomerTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateLoyaltyPointsSuccess, resetPointsAdded } =
  loyaltySlice.actions;
export default loyaltySlice.reducer;
