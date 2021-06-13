import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* WebpackChunkName: "snippet-create" */ './components/SnippetCreate.vue'),
    name: 'snippet-create'
  },
  {
    path: '/:hash(\\w+).:extension(\\w+)?',
    component: () => import(/* WebpackChunkName: "snippet-detail" */ './components/SnippetDetail.vue'),
    name: 'snippet-detail',
    props: true
  },
  {
    path: '/raw/:hash(\\w+)',
    component: () => import(/* WebpackChunkName: "snippet-raw" */ './components/SnippetRaw.vue'),
    name: 'snippet-raw',
    props: true
  }
];

export function createRouter() {
  return new VueRouter({
    routes,
    mode: 'history'
  });
}

export default createRouter();
