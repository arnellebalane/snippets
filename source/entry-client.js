import createApp from './app';
import './stylesheets/index.css';

const {app, router, store} = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const previousMatched = router.getMatchedComponents(from);

        let diffed = false;
        const rendered = matched.filter((c, i) => diffed || (diffed = previousMatched[i] !== c));

        if (rendered.length === 0) {
            return next();
        }

        Promise.all(rendered.map(Component => Component.serverData
            ? Component.serverData(store, to)
            : null
        )).then(next);
    });

    app.$mount('#app');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service worker registered', registration);
        }).catch(e => {
            console.warn('Service worker registration failed', e);
        });
    });
}
