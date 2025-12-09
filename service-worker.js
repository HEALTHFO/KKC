/*
 * Service Worker for KCC Professional Billing System
 *
 * This script caches the core application shell (HTML, CSS, JS and assets)
 * so that the app can be loaded offline after the first visit.  It uses
 * a cache-first strategy for navigation and a network-first strategy for
 * other requests.  Update the CACHE_NAME to trigger a refresh when
 * deploying new versions.
 */

const CACHE_NAME = 'kcc-billing-cache-v1';
const CORE_ASSETS = [
  'kcc_professional_billing.html',
  'manifest.json',
  'service-worker.js',
  'logo.png',
  // Note: Add other assets that should be cached for offline use
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    // Navigation requests: serve cached index or fallback to network
    event.respondWith(
      caches.match('kcc_professional_billing.html').then((cached) => {
        return cached || fetch(request);
      })
    );
    return;
  }
  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});