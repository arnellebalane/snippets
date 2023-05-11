import { createReducer } from '@reduxjs/toolkit';
import { initialSnippetState } from './state';
import {
    CLEAR_SNIPPET,
    CLEAR_SNIPPET_HASH,
    SAVE_SNIPPET_FAILURE,
    SAVE_SNIPPET_START,
    SAVE_SNIPPET_SUCCESS,
    SET_SNIPPET,
    SET_SNIPPET_HASH,
} from './actions';

export const snippetsReducer = createReducer(initialSnippetState, (builder) => {
    builder
        .addCase(SET_SNIPPET, (state, { payload }) => {
            state.snippet = payload;
        })
        .addCase(CLEAR_SNIPPET, (state) => {
            state.snippet = initialSnippetState.snippet;
        })
        .addCase(SET_SNIPPET_HASH, (state, { payload }) => {
            state.snippetHash = payload;
        })
        .addCase(CLEAR_SNIPPET_HASH, (state) => {
            state.snippetHash = initialSnippetState.snippetHash;
        })
        .addCase(SAVE_SNIPPET_START, (state) => {
            state.loading = true;
            state.error = undefined;
        })
        .addCase(SAVE_SNIPPET_SUCCESS, (state, { payload }) => {
            state.loading = false;
            state.snippetHash = payload.hash;
            state.snippet = payload.body;
        })
        .addCase(SAVE_SNIPPET_FAILURE, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
});
