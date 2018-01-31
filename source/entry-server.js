import createApp from './app';

export default function(context) {
    const { app } = createApp();
    return app;
};
