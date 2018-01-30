import createApp from './app';

export default function(context) {
    return new Promise((resolve, reject) => {
        const { app } = createApp();
        resolve(app);
    });
};
