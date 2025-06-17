import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up outdated caches
cleanupOutdatedCaches();

// Claim clients immediately
clientsClaim();

// Notify clients when a new service worker is waiting
self.addEventListener('waiting', () => {
  // Send message to all clients that an update is available
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'SW_UPDATE_AVAILABLE',
        timestamp: Date.now()
      });
    });
  });
});

// Notify clients when the service worker has been activated
self.addEventListener('activate', (event) => {
  // Send message to all clients that the update has been applied
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATED',
          timestamp: Date.now()
        });
      });
    })
  );
});

// RUNTIME CACHING STRATEGIES

// DEV ENVIRONMENT: Skip caching app files for local IPs and dev subdomains
registerRoute(
  ({ url }) => {
    const isLocalIP = /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(url.href);
    const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(url.hostname);
    const isAppFile = url.pathname.match(/\.(js|css|html|json|xml|txt)$/i) || 
                     url.pathname === "/" || 
                     url.pathname.startsWith("/assets/") || 
                     !url.pathname.includes(".");
    return (isLocalIP || isDevSubdomain) && isAppFile;
  },
  new NetworkOnly(),
  'dev-no-cache'
);

// DEV ENVIRONMENT: Cache static assets (fonts, images) even from local/dev sources
registerRoute(
  ({ url }) => {
    const isLocalIP = /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(url.href);
    const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(url.hostname);
    const isAssetFile = url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot|svg|ico)$/i);
    return (isLocalIP || isDevSubdomain) && isAssetFile;
  },
  new CacheFirst({
    cacheName: "nomercy-fonts-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// FONTS: Long-term cache for fonts
registerRoute(
  ({ url }) => {
    return /\.(woff2?|ttf|eot)$/i.test(url.pathname) || url.pathname.includes("/fonts/");
  },
  new CacheFirst({
    cacheName: "nomercy-fonts-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// IMAGES: Cache first strategy for images
registerRoute(
  ({ url }) => {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
  },
  new CacheFirst({
    cacheName: "nomercy-images-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10000,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// STATIC ASSETS: JS, CSS, JSON files
registerRoute(
  ({ url }) => {
    const isLocalIP = /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(url.href);
    const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(url.hostname);
    const isStaticAsset = /\.(js|css|json)$/i.test(url.pathname);
    return !isLocalIP && !isDevSubdomain && isStaticAsset;
  },
  new CacheFirst({
    cacheName: "nomercy-static-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// API REQUESTS: Stale-while-revalidate strategy
registerRoute(
  ({ url }) => {
    return /\/api\/.*$/.test(url.pathname) || 
           /\/auth\/.*$/.test(url.pathname) || 
           url.hostname.includes("api") || 
           /^api.nomercy\.tv/.test(url.hostname);
  },
  new StaleWhileRevalidate({
    cacheName: "nomercy-api-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BackgroundSyncPlugin("nomercy-api-v5", {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// NOMERCY CDN: Cache first for CDN assets
registerRoute(
  /^https:\/\/(cdn|storage|cdn-dev)\.nomercy\.tv\/.*/i,
  new CacheFirst({
    cacheName: "nomercy-cdn-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10000,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BackgroundSyncPlugin("nomercy-cdn-v5", {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// COVER IMAGES: Specific pattern for API server images
registerRoute(
  ({ url }) => {
    const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(url.hostname);
    const isImageRequest = url.pathname.match(/\/images\/.*?\.(jpg|jpeg|png|gif|webp|avif)$/i);
    return isApiServer && isImageRequest;
  },
  new CacheFirst({
    cacheName: "nomercy-cover-images-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100000,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BackgroundSyncPlugin("nomercy-cover-images-v5", {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// NOMERCY APP: Network first for main app
registerRoute(
  /^https:\/\/app\.nomercy\.tv\/.*/i,
  new NetworkFirst({
    cacheName: "nomercy-app-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BackgroundSyncPlugin("nomercy-app-v5", {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// DYNAMIC CONTENT: Default handler for other requests
registerRoute(
  ({ url }) => {
    // Catch-all for navigation and other requests (not already handled)
    return !url.pathname.startsWith("/api/") && 
           !url.pathname.startsWith("/auth/") && 
           !url.pathname.match(/\.(js|css|json|woff2?|ttf|eot|jpg|jpeg|png|gif|webp|avif|svg)$/i);
  },
  new NetworkFirst({
    cacheName: "nomercy-dynamic-v5",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 3,
  })
);
