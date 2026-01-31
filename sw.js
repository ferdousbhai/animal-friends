const CACHE_NAME = 'animal-friends-v2';
const urlsToCache = [
  '/animal-friends/',
  '/animal-friends/index.html',
  '/animal-friends/manifest.json',
  '/animal-friends/sounds/cat-meow.mp3',
  '/animal-friends/sounds/dog-bark.mp3',
  '/animal-friends/sounds/cow-moo.mp3',
  '/animal-friends/sounds/pig-oink.mp3',
  '/animal-friends/sounds/sheep-baa.mp3',
  '/animal-friends/sounds/duck-quack.mp3',
  '/animal-friends/sounds/horse-neigh.mp3',
  '/animal-friends/sounds/chicken-cluck.mp3',
  '/animal-friends/sounds/goat-bleat.mp3'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch with cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses or non-GET requests
          if (!response || response.status !== 200 || event.request.method !== 'GET') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        });
      })
  );
});
