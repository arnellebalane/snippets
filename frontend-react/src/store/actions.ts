import { createAction } from '@reduxjs/toolkit';

export const SET_SNIPPET = createAction<string>('SET_SNIPPET');
export const CLEAR_SNIPPET = createAction('CLEAR_SNIPPET');

export const SAVE_SNIPPET = createAction('SAVE_SNIPPET');
