const CACHE_NAME = 'devfest-2025-v3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/gdg_logo.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 SW installing...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        // Try to cache each URL individually, ignore failures
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log('⚠️ Failed to cache:', url);
            });
          })
        );
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('✅ SW activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  const url = new URL(request.url);
  
  // Skip external domains completely
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // For navigation, try network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/').then(r => r || fetch(request)))
    );
    return;
  }
  
  // For other same-origin requests: cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          return cached;
        }
        
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Silently fail, browser will handle
            return new Response('', { status: 404 });
          });
      })
  );
});

console.log('📱 Service Worker loaded');
