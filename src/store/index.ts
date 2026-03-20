import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import calcReducer from './slices/calcSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    calc: calcReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
