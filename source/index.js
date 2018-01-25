import Vue from 'vue';
import SnippetsApp from './components/snippets-app.vue';

import './stylesheets/index.css';

new Vue({
    el: '#app',
    render: h => h(SnippetsApp)
});
