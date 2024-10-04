import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  message: "",
  error: null,
};

// Async thunk to send an email
export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (emailDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/sendmail/send-email",
        emailDetails
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default emailSlice.reducer;
