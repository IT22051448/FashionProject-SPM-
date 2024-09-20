import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import adminStockSlice from "./stockSlice";
import supplierSlice from "./supplierSlice";
import mailslice from "./mailSlice/mailSlice";
import tokenReducer from "./supplierToken/supplierTokenSlice"; 

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authReducer,
  stock: adminStockSlice,
  supplier: supplierSlice,
  email: mailslice,
  token: tokenReducer, // Add the token reducer here
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
