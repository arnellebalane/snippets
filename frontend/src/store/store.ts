import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { snippetsReducer } from './reducer';
import { SnippetsSaga } from './saga';

const saga = new SnippetsSaga();
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: snippetsReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(saga.sagas);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
