import createApp from './app';

export default function(context) {
    return new Promise((resolve, reject) => {
        const { app, router } = createApp();

        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            return matchedComponents.length
                ? resolve(app)
                : reject({ code: 404 });
        }, reject);
    });
};
