import createApp from './app';

export default function(context) {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp();

        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject({ code: 404 });
            }

            Promise.all(matchedComponents.map(Component => {
                if (Component.serverData) {
                    return Component.serverData(store, router.currentRoute);
                }
            })).then(() => {
                context.state = store.state;
                resolve(app);
            });
        }, reject);
    });
};
