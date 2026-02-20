import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice'; // The Super Admin settings
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    // we will add studentReducer here later
  },
});