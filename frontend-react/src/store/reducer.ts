import { createReducer } from '@reduxjs/toolkit';
import { initialSnippetState } from './state';
import { CLEAR_SNIPPET, SET_SNIPPET } from './actions';

export const snippetsReducer = createReducer(initialSnippetState, (builder) => {
    builder
        .addCase(SET_SNIPPET, (state, { payload }) => {
            state.snippet = payload;
        })
        .addCase(CLEAR_SNIPPET, (state) => {
            state.snippet = initialSnippetState.snippet;
        });
});
