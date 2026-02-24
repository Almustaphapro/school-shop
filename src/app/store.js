import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/students/studentSlice"; 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "students"], // Only persist auth and students, maybe not transactions
};

const rootReducer = combineReducers({
  auth: authReducer,
  students: studentReducer,
  // ... other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);