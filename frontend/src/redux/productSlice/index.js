import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    console.log(result);

    return result?.data;
  }
);

export const addProduct = createAsyncThunk(
  "/products/add",
  async (formData, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const getProducts = createAsyncThunk("/products/get", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}products/`);
  return response.data;
});

export const getProduct = createAsyncThunk(
  "/products/getProduct",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}products/${id}`
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "/products/updateProduct",
  async ( {id, formData},{ getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/delete",
  async (id, { getState }) => {
    const auth = getState().auth;
    const token = auth.token;
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

const ProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.succes
          ? state.products.push(action.payload.product)
          : state.products;
      })
      .addCase(addProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.success ? action.payload.products : [];
      })
      .addCase(getProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.success
          ? state.products.map((product) =>
              product._id === action.payload.product._id
                ? action.payload.product
                : product
            )
          : state.products;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.succes
          ? state.products.filter(
              (product) => product._id !== action.payload.id
            )
          : state.products;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setProductDetails } = ProductsSlice.actions;
export default ProductsSlice.reducer;
