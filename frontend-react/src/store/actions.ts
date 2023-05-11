import { createAction } from '@reduxjs/toolkit';
import { Snippet } from '~/interfaces';

export const SET_SNIPPET = createAction<string>('SET_SNIPPET');
export const CLEAR_SNIPPET = createAction('CLEAR_SNIPPET');

export const SET_SNIPPET_HASH = createAction<string>('SET_SNIPPET_HASH');
export const CLEAR_SNIPPET_HASH = createAction('CLEAR_SNIPPET_HASH');

export const CLEAR_LOADING = createAction('CLEAR_LOADING');

export const SAVE_SNIPPET = createAction('SAVE_SNIPPET');
export const SAVE_SNIPPET_START = createAction('SAVE_SNIPPET_START');
export const SAVE_SNIPPET_SUCCESS = createAction<Snippet>('SAVE_SNIPPET_SUCCESS');
export const SAVE_SNIPPET_FAILURE = createAction<Error>('SAVE_SNIPPET_FAILURE');

export const GET_SNIPPET = createAction<string>('GET_SNIPPET');
export const GET_SNIPPET_START = createAction('GET_SNIPPET_START');
export const GET_SNIPPET_SUCCESS = createAction<Snippet>('GET_SNIPPET_SUCCESS');
export const GET_SNIPPET_FAILURE = createAction<Error>('GET_SNIPPET_FAILURE');
