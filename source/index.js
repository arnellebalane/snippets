import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import SnippetsApp from './components/snippets-app.vue';

import './stylesheets/index.css';

Vue.use(Vuex);
Vue.use(VueRouter);

new Vue({
    el: '#app',
    store: require('./store').default,
    router: require('./router').default,
    render: h => h(SnippetsApp)
});
