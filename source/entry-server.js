import createApp from './app';

export default function (context) {
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp();

        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (matchedComponents.length === 0) {
                return reject(new Error({code: 404}));
            }

            Promise.all(matchedComponents.map(Component => Component.serverData
                    ? Component.serverData(store, router.currentRoute)
                    : null
            )).then(() => {
                context.state = store.state;
                resolve(app);
            }).catch(reject);
        }, reject);
    });
}
