import VueRouter from 'vue-router';

const routes = [ {
    path: '/',
    component: () => import(/* webpackChunkName: "snippet-create" */ './components/snippet-create.vue'),
    name: 'snippet-create'
}, {
    path: '/:hash',
    component: () => import(/* webpackChunkName: "snippet-detail" */ './components/snippet-detail.vue'),
    name: 'snippet-detail',
    props: true
} ];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;
