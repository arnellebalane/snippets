import Vue from 'vue';
import router from './router';
import store from './store';
import SnippetsApp from './components/snippets-app.vue';
import './stylesheets/index.css';

new Vue({
    el: '#app',
    router,
    store,
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
