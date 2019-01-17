import Vue from 'vue';
import router from './router';
import store from './store';
import SnippetsApp from './components/snippets-app.vue';
import './stylesheets/index.css';

// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(SnippetsApp)
});
