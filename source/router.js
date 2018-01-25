import VueRouter from 'vue-router';

const routes = [ {
    path: '/',
    component: require('./components/snippet-create.vue').default,
    name: 'snippet-create'
}, {
    path: '/:hash',
    component: require('./components/snippet-detail.vue').default,
    name: 'snippet-detail'
} ];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;
