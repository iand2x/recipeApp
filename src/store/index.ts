import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './slices/recipesSlice';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
