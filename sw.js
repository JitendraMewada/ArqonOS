const CACHE_NAME = 'arqonos-cache-v2';
const OFFLINE_URL = '/offline.html'; // Assuming an offline route exists or will be handled by React Router eventually

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/android-chrome-96x96.png',
  '/assets/icons/maskable_icon.png',
  '/assets/icons/quest-shortcut-96x96.png',
  '/assets/icons/connect-shortcut-96x96.png'
];

// Install Event: Individual caching to prevent failure if one asset is missing
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('[ArqonOS SW] Pre-caching Core App Shell');
        for (const url of APP_SHELL_URLS) {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn(`[ArqonOS SW] Failed to cache ${url}:`, err);
          }
        }
      })
  );
});

// Activate Event: Clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('arqonos-cache-')) {
              console.log('[ArqonOS SW] Deleting out of date cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch Event: Robust Network-First for navigation, Stale-While-Revalidate for assets
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Navigation requests (root / index.html): Network First
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request) || caches.match('/index.html'))
    );
    return;
  }

  // Assets and other requests: Stale-While-Revalidate
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for failed asset fetch
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notification Event Listener (Foundational Hook for later)
self.addEventListener('push', event => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  
  const data = event.data?.json() ?? {};
  const title = data.title || 'ArqonOS Notification';
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/assets/icons/android-chrome-192x192.png',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Routing
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
      // If a window is already open, focus it
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
