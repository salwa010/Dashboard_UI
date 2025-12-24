const CACHE_NAME = "html-pwa-v1";
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/scss/style.css',
  '/assets/js/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        FILES_TO_CACHE.map(async (url) => {
          try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            await cache.put(url, resp.clone());
          } catch (err) {
            console.warn('ServiceWorker: failed to cache', url, err);
          }
        })
      );
    })
  );
  // Ensure the new service worker activates immediately
  event.waitUntil(self.skipWaiting());
});

// Clean up old caches and take control of clients immediately on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve(true);
        })
      ).then(() => self.clients.claim())
    )
  );
});

// Allow web page to message the SW to skip waiting (optional trigger)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
