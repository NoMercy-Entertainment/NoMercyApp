// Enhanced Service Worker for NoMercy App
// This service worker implements intelligent caching strategies for optimal performance

const CACHE_VERSION = 'v5';
const STATIC_CACHE = `nomercy-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `nomercy-dynamic-${CACHE_VERSION}`;
const API_CACHE = `nomercy-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `nomercy-images-${CACHE_VERSION}`;
const FONT_CACHE = `nomercy-fonts-${CACHE_VERSION}`;

// Cache duration in milliseconds
const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  API: 5 * 60 * 1000, // 5 minutes
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  FONTS: 365 * 24 * 60 * 60 * 1000, // 1 year
};

// Static assets to pre-cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Critical fonts
  '/fonts/Inter-roman.var-latin.woff2',
  '/fonts/mooooom-icons.woff2',
  // Critical icons
  '/img/icons/android-chrome-192x192.png',
  '/img/icons/android-chrome-512x512.png',
];

// Routes that should always go to network first
const NETWORK_FIRST_ROUTES = [
  /\/api\/.*$/,
  /\/auth\/.*$/,
  /\/websocket.*$/,
];

// Routes that can be served from cache first
const CACHE_FIRST_ROUTES = [
  /\.(?:js|css|woff2?|ttf|eot)$/,
  /\/images\/.*\.(jpg|jpeg|png|gif|webp|avif)$/i,
  /\/fonts\/.*$/,
];

// Install event - pre-cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const deletePromises = cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('nomercy-') && 
                   !cacheName.includes(CACHE_VERSION);
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          });
        
        return Promise.all(deletePromises);
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isFontRequest(url)) {
    event.respondWith(handleFontRequest(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isNetworkFirstRoute(url)) {
    event.respondWith(handleNetworkFirst(request));
  } else {
    event.respondWith(handleDefault(request));
  }
});

// Check if request is for API
function isAPIRequest(url) {
  return NETWORK_FIRST_ROUTES.some(pattern => pattern.test(url.pathname)) ||
         url.hostname.includes('api') ||
         url.pathname.startsWith('/api/');
}

// Check if request is for images
function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
}

// Check if request is for fonts
function isFontRequest(url) {
  return /\.(woff2?|ttf|eot)$/i.test(url.pathname) ||
         url.pathname.includes('/fonts/');
}

// Check if request is for static assets
function isStaticAsset(url) {
  return CACHE_FIRST_ROUTES.some(pattern => pattern.test(url.pathname)) ||
         /\.(js|css|json)$/i.test(url.pathname);
}

// Check if route should be network first
function isNetworkFirstRoute(url) {
  return NETWORK_FIRST_ROUTES.some(pattern => pattern.test(url.pathname));
}

// Handle API requests with stale-while-revalidate strategy
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Start fetch request immediately
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        // Clone and cache the response
        const responseClone = response.clone();
        await cache.put(request, responseClone);
      }
      return response;
    })
    .catch(() => {
      // Network failed, return cached response if available
      return cachedResponse;
    });
  
  // If we have a cached response, return it immediately and update in background
  if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.API)) {
    // Update cache in background
    fetchPromise.catch(() => {}); // Ignore errors for background update
    return cachedResponse;
  }
  
  // No cache or expired, wait for network
  return fetchPromise;
}

// Handle image requests with cache first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.IMAGES)) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    return response;
  } catch {
    return cachedResponse || new Response('', { status: 404 });
  }
}

// Handle font requests with cache first strategy (long-term cache)
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    return response;
  } catch {
    return new Response('', { status: 404 });
  }
}

// Handle static assets with cache first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.STATIC)) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    return response;
  } catch {
    return cachedResponse || new Response('', { status: 404 });
  }
}

// Handle network first requests
async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Default handler for other requests
async function handleDefault(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(STATIC_CACHE);
      return offlineCache.match('/offline.html') || 
             new Response('Offline', { status: 503 });
    }
    
    return new Response('', { status: 404 });
  }
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const cacheTime = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - cacheTime) > maxAge;
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName);
      break;
      
    case 'PRELOAD_ROUTES':
      preloadRoutes(payload.routes);
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
  }
});

// Clear specific cache
async function clearSpecificCache(cacheName) {
  try {
    await caches.delete(cacheName);
    console.log(`[SW] Cleared cache: ${cacheName}`);
  } catch (error) {
    console.error(`[SW] Failed to clear cache ${cacheName}:`, error);
  }
}

// Preload specific routes
async function preloadRoutes(routes) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  const preloadPromises = routes.map(async (route) => {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await cache.put(route, response);
        console.log(`[SW] Preloaded route: ${route}`);
      }
    } catch (error) {
      console.warn(`[SW] Failed to preload route ${route}:`, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
}

// Get cache status for monitoring
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = {
      entryCount: keys.length,
      version: cacheName.includes(CACHE_VERSION) ? CACHE_VERSION : 'old'
    };
  }
  
  return status;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-upload') {
    event.waitUntil(syncOfflineActions());
  }
});

// Sync offline actions when back online
async function syncOfflineActions() {
  try {
    // Retrieve offline actions from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, action.options);
        await removeOfflineAction(action.id);
        console.log('[SW] Synced offline action:', action.id);
      } catch (error) {
        console.warn('[SW] Failed to sync offline action:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineActions() {
  // Implement IndexedDB retrieval
  return [];
}

async function removeOfflineAction(id) {
  // Implement IndexedDB removal
}

console.log('[SW] Enhanced service worker loaded');
