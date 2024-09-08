import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  approvalURL: null,
  isLoading: false,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}order/`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const getAllOrders = createAsyncThunk(
  "/order/getAllOrders",
  async (_, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    console.log(token, "token");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}order/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, "data");

    return response.data;
  }
);

export const getOrder = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}order/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}order/${id}`,
      {
        orderStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

const orderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrders.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;
