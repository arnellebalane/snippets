import createApp from './app';
import './stylesheets/index.css';

const { app, router } = createApp();

router.onReady(() => {
    app.$mount('#app');
});
