import { configureStore } from '@reduxjs/toolkit';
import { snippetsReducer } from './reducer';

export const store = configureStore({
    reducer: snippetsReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
