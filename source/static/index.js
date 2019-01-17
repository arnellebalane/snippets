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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service worker registered', registration);
        }).catch(e => {
            console.warn('Service worker registration failed', e);
        });
    });
}
