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
}];

export default new VueRouter({
    routes,
    mode: 'history'
});
