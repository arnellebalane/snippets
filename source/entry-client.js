import createApp from './app';
import './stylesheets/index.css';

const { app, router, store } = createApp();

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const previousMatched = router.getMatchedComponents(from);

        let diffed = false;
        const rendered = matched.filter((c, i) => diffed || (diffed = previousMatched[i] !== c));

        if (!rendered.length) return next();

        Promise.all(rendered.map(Component => {
            if (Component.serverData) {
                return Component.serverData(store, to);
            }
        })).then(next);
    });

    app.$mount('#app');
});
