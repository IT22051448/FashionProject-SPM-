import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}auth/login`,
    formData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logOutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.token = action.payload.success ? action.payload.token : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.token = action.payload.success ? action.payload.token : null;
        state.isAuthenticated = action.payload.success ? true : false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserInfo, logOutUser } = authSlice.actions;
export default authSlice.reducer;
