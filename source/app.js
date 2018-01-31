import Vue from 'vue';
import createRouter from './router';
import SnippetsApp from './components/snippets-app.vue';

export default function createApp() {
    const router = createRouter();

    const app = new Vue({
        router,
        render: h => h(SnippetsApp)
    });

    return { app, router };
};
