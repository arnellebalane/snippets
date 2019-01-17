import Vue from 'vue';
import createRouter from './router';
import createStore from './store';
import SnippetsApp from './components/snippets-app.vue';
import './stylesheets/index.css';

// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: '#app',
    router: createRouter(),
    store: createStore(),
    render: h => h(SnippetsApp)
});
