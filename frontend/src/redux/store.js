import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import address from "./addressSlice";
import storage from "redux-persist/lib/storage";

import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import adminStockSlice from "./stockSlice";
import supplierSlice from "./supplierSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  address: address,
  stock: adminStockSlice,
  supplier: supplierSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  devTools: true,
});

export const persistor = persistStore(store);
export default store;
