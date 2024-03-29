import { all, put, select, takeEvery, takeLeading } from 'redux-saga/effects';
import { Snippet } from '~/interfaces';
import { SNIPPETS_API_URL } from '~/utils/constants';
import {
    GET_SNIPPET,
    GET_SNIPPET_FAILURE,
    GET_SNIPPET_START,
    GET_SNIPPET_SUCCESS,
    SAVE_SNIPPET,
    SAVE_SNIPPET_FAILURE,
    SAVE_SNIPPET_START,
    SAVE_SNIPPET_SUCCESS,
} from './actions';

export class SnippetsSaga {
    constructor() {
        this.sagas = this.sagas.bind(this);
    }

    *sagas() {
        yield all([this.saveSnippetWatcher(), this.getSnippetWatcher()]);
    }

    *saveSnippetWatcher() {
        yield takeLeading(SAVE_SNIPPET.type, this.saveSnippet.bind(this));
    }

    *getSnippetWatcher() {
        yield takeEvery(GET_SNIPPET.type, this.getSnippet.bind(this));
    }

    *saveSnippet() {
        yield put(SAVE_SNIPPET_START());
        const snippet: string = yield select((state) => state.snippet);

        try {
            const response: Response = yield fetch(`${SNIPPETS_API_URL}/snippets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ snippet }),
            });
            const data: Snippet = yield response.json();
            yield put(SAVE_SNIPPET_SUCCESS(data));
        } catch (error: unknown) {
            yield put(SAVE_SNIPPET_FAILURE(error as Error));
        }
    }

    *getSnippet({ payload: hash }: ReturnType<typeof GET_SNIPPET>) {
        yield put(GET_SNIPPET_START());

        try {
            const response: Response = yield fetch(`${SNIPPETS_API_URL}/snippets/${hash}`);
            const data: Snippet = yield response.json();
            yield put(GET_SNIPPET_SUCCESS(data));
        } catch (error: unknown) {
            yield put(GET_SNIPPET_FAILURE(error as Error));
        }
    }
}
