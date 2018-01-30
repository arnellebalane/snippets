import Vue from 'vue';
import router from './router';
import store from './store';
import SnippetsApp from './components/snippets-app.vue';

import './stylesheets/index.css';

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(SnippetsApp)
});
