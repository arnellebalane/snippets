importScripts('/statics/workbox-sw.js');

const workbox = new WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

workbox.router.registerRoute('/', workbox.strategies.cacheFirst());

workbox.precache([]);
