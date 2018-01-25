import Vue from 'vue';
import VueRouter from 'vue-router';
import SnippetsApp from './components/snippets-app.vue';

import './stylesheets/index.css';

Vue.use(VueRouter);

new Vue({
    el: '#app',
    router: require('./router').default,
    render: h => h(SnippetsApp)
});
