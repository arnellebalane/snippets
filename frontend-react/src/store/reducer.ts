import { createReducer } from '@reduxjs/toolkit';
import { initialSnippetState } from './state';
import { CLEAR_SNIPPET, CLEAR_SNIPPET_HASH, SET_SNIPPET, SET_SNIPPET_HASH } from './actions';

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
        });
});
