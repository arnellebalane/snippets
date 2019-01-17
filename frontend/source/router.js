import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    component: () => import(/* webpackChunkName: "snippet-create" */ './components/snippet-create.vue'),
    name: 'snippet-create'
}, {
    path: '/:hash(\\w+).:extension(\\w+)?',
    component: () => import(/* webpackChunkName: "snippet-detail" */ './components/snippet-detail.vue'),
    name: 'snippet-detail',
    props: true
}, {
    path: '/raw/:hash(\\w+)',
    component: () => import(/* webpackChunkName: "snippet-raw" */ './components/snippet-raw.vue'),
    name: 'snippet-raw',
    props: true
}];

export function createRouter() {
    return new VueRouter({
        routes,
        mode: 'history'
    });
}

export default createRouter();
