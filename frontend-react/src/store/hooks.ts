import { createDispatcher, useAppSelector } from './helpers';
import { CLEAR_SNIPPET, SET_SNIPPET } from './actions';

export const useSnippet = () => useAppSelector((state) => state.snippet);

export const useSetSnippet = createDispatcher<string>(SET_SNIPPET);
export const useClearSnippet = createDispatcher(CLEAR_SNIPPET);
