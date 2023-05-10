import { all, select, takeEvery } from 'redux-saga/effects';
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
        console.log(snippet);
    }
}
