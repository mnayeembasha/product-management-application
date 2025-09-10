import { configureStore } from '@reduxjs/toolkit';
import themeReducer from "./themeSlice";
import authReducer from './authSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
      theme:themeReducer,
      auth: authReducer,
      product:productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;