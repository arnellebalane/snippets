import { createAction } from '@reduxjs/toolkit';

export const SET_SNIPPET = createAction<string>('SET_SNIPPET');
export const CLEAR_SNIPPET = createAction('CLEAR_SNIPPET');
