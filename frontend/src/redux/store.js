import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import loyaltyReducer from "./loyaltySlice/loyaltySlice";
import promoReducer from "./loyaltySlice/promoSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authReducer,
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

export default store;
