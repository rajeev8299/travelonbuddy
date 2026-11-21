const CACHE_NAME = 'travelonbuddy-static-v2';

// Dynamic base resolution from service worker registration scope
const BASE_PATH = self.registration ? self.registration.scope : '/';
const getPath = (p) => {
  const cleanP = p.startsWith('/') ? p.slice(1) : p;
  const cleanBase = BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`;
  return `${cleanBase}${cleanP}`;
};

const OFFLINE_FALLBACK = getPath('offline.html');

const STATIC_ASSETS = [
  BASE_PATH,
  getPath('offline.html'),
  getPath('manifest.json'),
  getPath('logo.png'),
  getPath('logo-transparent.png'),
  getPath('icon-192x192.png'),
  getPath('icon-512x512.png'),
  getPath('apple-touch-icon.png'),
  getPath('icon-maskable-192x192.png'),
  getPath('icon-maskable-512x512.png'),
  getPath('favicon.svg')
];

// Install: Cache essential assets & offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// 1. Never cache mutations, POST/PUT/DELETE, or auth/sensitive endpoints.
// 2. Navigation requests: Network-first with offline.html fallback.
// 3. Static assets: Stale-while-revalidate or Network-first.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Bypass chrome-extension and non-http schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle HTML navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(OFFLINE_FALLBACK);
        })
    );
    return;
  }

  // Handle static assets & images (Cache-first with network fallback)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2|woff)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => {/* ignore background fetch error */});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default network request for APIs, etc.
  event.respondWith(fetch(request));
});
