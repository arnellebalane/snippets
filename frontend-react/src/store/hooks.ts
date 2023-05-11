import { createDispatcher, useAppSelector } from './helpers';
import {
    CLEAR_LOADING,
    CLEAR_SNIPPET,
    CLEAR_SNIPPET_HASH,
    GET_SNIPPET,
    SAVE_SNIPPET,
    SET_SNIPPET,
    SET_SNIPPET_HASH,
} from './actions';

export const useSnippet = () => useAppSelector((state) => state.snippet);
export const useSnippetHash = () => useAppSelector((state) => state.snippetHash);

export const useLoadingStatus = () => {
    const loading = useAppSelector((state) => state.loading);
    const hasSnippetHash = useAppSelector((state) => Boolean(state.snippetHash));

    return {
        hasCalled: loading !== undefined,
        isLoading: loading,
        isComplete: loading === false && hasSnippetHash,
    };
};

export const useSetSnippet = createDispatcher<string>(SET_SNIPPET);
export const useClearSnippet = createDispatcher(CLEAR_SNIPPET);

export const useSetSnippetHash = createDispatcher<string>(SET_SNIPPET_HASH);
export const useClearSnippetHash = createDispatcher(CLEAR_SNIPPET_HASH);

export const useClearLoading = createDispatcher(CLEAR_LOADING);

export const useSaveSnippet = createDispatcher(SAVE_SNIPPET);
export const useGetSnippet = createDispatcher<string>(GET_SNIPPET);
