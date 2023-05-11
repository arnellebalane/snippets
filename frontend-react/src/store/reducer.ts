import { createReducer, isAnyOf } from '@reduxjs/toolkit';
import { initialSnippetState } from './state';
import {
    CLEAR_SNIPPET,
    CLEAR_SNIPPET_HASH,
    GET_SNIPPET_SUCCESS,
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
        .addMatcher(isAnyOf(SAVE_SNIPPET_SUCCESS, GET_SNIPPET_SUCCESS), (state, { payload }) => {
            state.snippetHash = payload.hash;
            state.snippet = payload.body;
        })
        .addMatcher(
            ({ type }) => type.endsWith('_START'),
            (state) => {
                state.loading = true;
                state.error = undefined;
            }
        )
        .addMatcher(
            ({ type }) => type.endsWith('_SUCCESS'),
            (state) => {
                state.loading = false;
            }
        )
        .addMatcher(
            ({ type }) => type.endsWith('_FAILURE'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }
        );
});
