const CACHE_NAME = "ems-cs-club-v11";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/about.html",
  "/achievements.html",
  "/settings.html",
  "/projects.html",
  "/style.css",
  "/assets/m3e.js",
  "/assets/site.js",
  "/manifest.json",
  "/earl-mariott-programming-club-logo.svg"
];

// Install: pre-cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for pages and code (so UI updates always appear when
// online), cache-first for everything else (fonts, images) with network fallback.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isDocument = event.request.mode === "navigate" || event.request.destination === "document";
  const isCode = /\.(?:js|css|html|json)$/.test(url.pathname);

  if (sameOrigin && (isDocument || isCode)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then((cached) =>
            cached || (isDocument ? caches.match("/index.html") : undefined)
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match("/index.html");
        });
    })
  );
});
