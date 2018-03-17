import Vue from 'vue';
import createRouter from './router';
import createStore from './store';
import SnippetsApp from './components/snippets-app.vue';

export default function createApp() {
    const router = createRouter();
    const store = createStore();

    const app = new Vue({
        router,
        store,
        render: h => h(SnippetsApp)
    });

    return {app, router, store};
}
