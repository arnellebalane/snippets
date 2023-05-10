import { createDispatcher, useAppSelector } from './helpers';
import { CLEAR_SNIPPET, CLEAR_SNIPPET_HASH, SAVE_SNIPPET, SET_SNIPPET, SET_SNIPPET_HASH } from './actions';

export const useSnippet = () => useAppSelector((state) => state.snippet);
export const useSnippetHash = () => useAppSelector((state) => state.snippetHash);

export const useSetSnippet = createDispatcher<string>(SET_SNIPPET);
export const useClearSnippet = createDispatcher(CLEAR_SNIPPET);

export const useSetSnippetHash = createDispatcher<string>(SET_SNIPPET_HASH);
export const useClearSnippetHash = createDispatcher(CLEAR_SNIPPET_HASH);

export const useSaveSnippet = createDispatcher(SAVE_SNIPPET);
