import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  approvalURL: null,
  isLoading: false,
  placedOrderId: null,
};

export const cancelPayment = createAsyncThunk(
  "/order/cancelPayment",
  async ({ orderId }, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}order/cancel-payment`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/order/confirmPayment",
  async ({ paymentId, payerId, orderId }, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}order/capture-payment`,
      {
        paymentId,
        payerId,
        orderId,
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

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.post(
      `http://localhost:5000/api/order/`,
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
    resetPlacedOrderId: (state) => {
      state.placedOrderId = null;
    },
    resetApprovalURL: (state) => {
      state.approvalURL = null;
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
      })
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.success
          ? action.payload.approvalURL
          : null;
        state.placedOrderId = action.payload.success
          ? action.payload.orderId
          : null;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
      });
  },
});

export const { resetOrderDetails, resetPlacedOrderId, resetApprovalURL } =
  orderSlice.actions;

export default orderSlice.reducer;
