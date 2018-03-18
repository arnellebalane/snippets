workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute('/', workbox.strategies.cacheFirst());

workbox.precaching.precacheAndRoute(self.__precacheManifest);
