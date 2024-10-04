import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import address from "./addressSlice";
import loyaltyReducer from "./loyaltySlice/loyaltySlice";
import promoReducer from "./loyaltySlice/promoSlice";
import storage from "redux-persist/lib/storage";

import { persistReducer } from "redux-persist";
import adminStockSlice from "./stockSlice";
import supplierSlice from "./supplierSlice";
import mailslice from "./mailSlice/mailSlice";
import tokenReducer from "./supplierToken/supplierTokenSlice"; 
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["product"],
};

const reducer = combineReducers({
  auth: authReducer,
  stock: adminStockSlice,
  supplier: supplierSlice,
  email: mailslice,
  token: tokenReducer, 
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  address: address,
  loyalty: loyaltyReducer,
  promo: promoReducer,
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
