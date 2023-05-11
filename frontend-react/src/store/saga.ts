import { all, put, select, takeEvery } from 'redux-saga/effects';
import { Snippet } from '~/interfaces';
import { SNIPPETS_API_URL } from '~/utils/constants';
import { SAVE_SNIPPET, SAVE_SNIPPET_FAILURE, SAVE_SNIPPET_START, SAVE_SNIPPET_SUCCESS } from './actions';

export class SnippetsSaga {
    constructor() {
        this.sagas = this.sagas.bind(this);
    }

    *sagas() {
        yield all([this.saveSnippetWatcher()]);
    }

    *saveSnippetWatcher() {
        yield takeEvery(SAVE_SNIPPET.type, this.saveSnippet.bind(this));
    }

    *saveSnippet() {
        yield put(SAVE_SNIPPET_START());
        const snippet: string = yield select((state) => state.snippet);

        try {
            const response: Response = yield fetch(SNIPPETS_API_URL + '/snippets', {
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
}
