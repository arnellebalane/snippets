import { all, select, takeEvery } from 'redux-saga/effects';
import { Snippet } from '~/interfaces';
import { SNIPPETS_API_URL } from '~/utils/constants';
import { SAVE_SNIPPET } from './actions';

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
        const snippet: string = yield select((state) => state.snippet);

        const response: Response = yield fetch(SNIPPETS_API_URL + '/snippets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ snippet }),
        });
        const data: Snippet = yield response.json();

        console.log(data);
    }
}
