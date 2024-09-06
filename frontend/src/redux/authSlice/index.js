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
      "http://localhost:5000/api/auth/register",
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
    "http://localhost:5000/api/auth/login",
    formData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("persist:root");

    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
});

export const clearNotifications = createAsyncThunk(
  "auth/clearNotifications",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/clear-notifications",
        { email },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
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
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        if (state.user) {
          state.user.notifications = []; // Clear notifications in Redux state after backend success
        }
      })
      .addCase(clearNotifications.rejected, (state, action) => {
        toast.error(action.payload || "Failed to clear notifications"); // Show error message if clearing fails
      });
  },
});

export const { setUserInfo } = authSlice.actions;
export default authSlice.reducer;
