import { useCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createAction } from '@reduxjs/toolkit';
import { AppDispatch, AppState } from './store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const createDispatcher = <PayloadType = void>(actionCreator: ReturnType<typeof createAction>) => {
    return () => {
        const dispatch = useAppDispatch();
        return useCallback(
            (payload: PayloadType) => {
                dispatch(actionCreator(payload));
            },
            [dispatch]
        );
    };
};
