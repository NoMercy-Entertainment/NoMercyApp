/// <reference types="vitest" />
import path from "path";
import fs from "fs";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { ViteCspPlugin } from "vite-plugin-csp";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import vue from "@vitejs/plugin-vue";
import { env } from "process";

// @ts-ignore
export default defineConfig(({ command }) => {
  return {
    define: {
      // Add build timestamp for cache busting
      __BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
      __BUILD_VERSION__: JSON.stringify(
        process.env.npm_package_version || "1.0.0"
      ),
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) =>
              [
                // 'google-cast-launcher',
              ].includes(tag),
          },
          transformAssetUrls: {
            // ...
          },
        },
      }),
      VitePWA({
        strategies: "generateSW",
        registerType: "prompt",
        workbox: {
          cleanupOutdatedCaches: true,
          // clientsClaim: true,
          sourcemap: false,
          mode: env.NODE_ENV === "production" ? "production" : "development",
          dontCacheBustURLsMatching: /\.\w{8}\./,
          navigateFallback: "index.html",
          navigateFallbackDenylist: [
            /^\/_/, // Private paths
            /\/[^/?]+\.[^/]+$/, // Files with extensions
            /\.(?:js|css|html|ico|png|svg|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|xml|txt)$/i, // Asset extensions
            /^\/icons\/optimized\/.*\.svg$/i, // Icon optimization service URLs
            /^\/icons\/general\/.*\.svg$/i, // Icon fallback URLs
          ],
          maximumFileSizeToCacheInBytes: 25 * 1024 * 1024 * 1024, // 25GB per item
          runtimeCaching: [
            // DEV ENVIRONMENT: Skip caching app files for local IPs and dev subdomains
            {
              urlPattern: ({ url }) => {
                const isLocalIP =
                  /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(
                    url.href
                  );
                const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
                  url.hostname
                );
                const isAppFile =
                  url.pathname.match(/\.(js|css|html|json|xml|txt)$/i) ||
                  url.pathname === "/" ||
                  url.pathname.startsWith("/assets/") ||
                  !url.pathname.includes(".");

                // Skip caching for Vue app files in dev environment
                return (isLocalIP || isDevSubdomain) && isAppFile;
              },
              handler: "NetworkOnly",
              options: {
                cacheName: "dev-no-cache",
              },
            },

            // DEV ENVIRONMENT: Cache static assets (fonts, images) even from local/dev sources
            {
              urlPattern: ({ url }) => {
                const isLocalIP =
                  /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(
                    url.href
                  );
                const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
                  url.hostname
                );
                const isAssetFile = url.pathname.match(
                  /\.(png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot|svg|ico)$/i
                );

                return (isLocalIP || isDevSubdomain) && isAssetFile;
              },
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-fonts-v5", // Updated version for cache invalidation
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year like enhanced-sw fonts
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            // FONTS: Long-term cache for fonts (matches enhanced-sw FONT_CACHE strategy)
            {
              urlPattern: ({ url }) => {
                return (
                  /\.(woff2?|ttf|eot)$/i.test(url.pathname) ||
                  url.pathname.includes("/fonts/")
                );
              },
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-fonts-v5",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            // IMAGES: Cache first strategy for images (matches enhanced-sw IMAGE_CACHE)
            {
              urlPattern: ({ url }) => {
                return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(
                  url.pathname
                );
              },
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-images-v5",
                expiration: {
                  maxEntries: 10000,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            // STATIC ASSETS: JS, CSS, JSON files (matches enhanced-sw STATIC_CACHE)
            {
              urlPattern: ({ url }) => {
                const isLocalIP =
                  /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+)(?::\d+)?/.test(
                    url.href
                  );
                const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
                  url.hostname
                );
                const isStaticAsset = /\.(js|css|json)$/i.test(url.pathname);

                // Only cache static assets from production sources
                return !isLocalIP && !isDevSubdomain && isStaticAsset;
              },
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-static-v5",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            // API REQUESTS: Stale-while-revalidate strategy (matches enhanced-sw API_CACHE)
            {
              urlPattern: ({ url }) => {
                return /^api.nomercy\.tv/.test(url.hostname);
              },
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "nomercy-api-v5",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 5 * 60, // 5 minutes
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                backgroundSync: {
                  name: "nomercy-api-v5",
                  options: { forceSyncFallback: true },
                },
              },
            },

            // NOMERCY CDN: Cache first for CDN assets
            {
              urlPattern: /^https:\/\/(cdn|storage|cdn-dev)\.nomercy\.tv\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-cdn-v5",
                expiration: {
                  maxEntries: 10000,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                backgroundSync: {
                  name: "nomercy-cdn-v5",
                  options: { forceSyncFallback: true },
                },
              },
            },

            // COVER IMAGES: Specific pattern for API server images
            {
              urlPattern: ({ url }) => {
                const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
                  url.hostname
                );
                const isImageRequest = url.pathname.match(
                  /\/images\/.*?\.(jpg|jpeg|png|gif|webp|avif)$/i
                );
                return isApiServer && isImageRequest;
              },
              handler: "CacheFirst",
              options: {
                cacheName: "nomercy-cover-images-v5",
                expiration: {
                  maxEntries: 100000,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                backgroundSync: {
                  name: "nomercy-cover-images-v5",
                  options: { forceSyncFallback: true },
                },
              },
            },

            // NOMERCY APP: Network first for main app
            {
              urlPattern: /^https:\/\/app\.nomercy\.tv\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "nomercy-app-v5",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                backgroundSync: {
                  name: "nomercy-app-v5",
                  options: { forceSyncFallback: true },
                },
              },
            },

            // DYNAMIC CONTENT: Default handler for other requests
            {
              urlPattern: ({ url }) => {
                // Catch-all for navigation and other requests (not already handled)
                return (
                  !url.pathname.startsWith("/api/") &&
                  !url.pathname.startsWith("/auth/") &&
                  !url.pathname.match(
                    /\.(js|css|json|woff2?|ttf|eot|jpg|jpeg|png|gif|webp|avif|svg)$/i
                  )
                );
              },
              handler: "NetworkFirst",
              options: {
                cacheName: "nomercy-dynamic-v5",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
                networkTimeoutSeconds: 3,
              },
            },
          ],
        },
        manifest: {
          name: "NoMercy TV",
          short_name: "NoMercy TV",
          description:
            "Encode and archive all your movies and tv show's, and play them on all your devices.",
          categories: [
            "video",
            "encoder",
            "player",
            "library",
            "nomercy",
            "server",
          ],
          theme_color: "#000000",
          background_color: "#000000",
          display: "standalone",
          orientation: "any",
          scope: "/",
          start_url: "/",
          display_override: [
            "standalone",
            "window-controls-overlay",
            "fullscreen",
          ],
          iarc_rating_id: "6",
          id: "tv.nomercy.app",
          protocol_handlers: [
            {
              protocol: "web+nomercy",
              url: "/%s",
            },
          ],
          prefer_related_applications: true,
          icons: [
            {
              src: "/img/icons/android-chrome-512x512.png",
              sizes: "512x512",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-512x512.png",
              sizes: "512x512",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-384x384.png",
              sizes: "384x384",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-256x256.png",
              sizes: "256x256",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-192x192.png",
              sizes: "192x192",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-144x144.png",
              sizes: "144x144",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-96x96.png",
              sizes: "96x96",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-72x72.png",
              sizes: "72x72",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-48x48.png",
              sizes: "48x48",
              purpose: "maskable",
            },
            {
              src: "/img/icons/android-chrome-36x36.png",
              sizes: "36x36",
              purpose: "maskable",
            },
          ],
          screenshots: [],
          shortcuts: [
            {
              name: "Home",
              short_name: "Home",
              url: "/",
              icons: [
                {
                  src: "/img/icons/android-chrome-192x192.png",
                  sizes: "192x192",
                  type: "image/png",
                  purpose: "any",
                },
              ],
            },
          ],
        },
        devOptions: {
            enabled: false,
            type: 'module',
            navigateFallback: 'index.html',
            suppressWarnings: false,
        },
      }),
      ViteCspPlugin(
        {
          "base-uri": ["self"],
          "object-src": ["self", "blob:"],
          "script-src": [
            "self",
            "unsafe-eval",
            "unsafe-inline",
            "unsafe-hashes",
            "https://www.youtube.com",
            "https://nomercy.tv",
            "http://localhost:5503",
            "https://*.nomercy.tv",
            "https://vscode.nomercy.tv",
            "https://trailer.nomercy.tv",
            "https://*.nomercy.tv:*",
            "https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js",
            "https://www.gstatic.com",
            "https://static.cloudflareinsights.com",
          ],
          "style-src-attr": ["unsafe-inline"],
          "style-src": [
            "self",
            "unsafe-inline",
            "unsafe-eval",
            "https://cdn.nomercy.tv",
            "https://cdn-dev.nomercy.tv",
            "https://storage.nomercy.tv",
            "https://fonts.bunny.net",
          ],
          "img-src": [
            "self",
            "blob:",
            "data:",
            "https://nomercy.tv",
            "https://*.nomercy.tv:*",
            "https://*.nomercy.tv",
            "https://*.spotify.com/*",
            "https://*.archive.org",
            "https://archive.org",
            "https://coverartarchive.org",
            "https://i.ytimg.com",
            "https://image.tmdb.org",
            "https://media.themoviedb.org",
            "https://lastfm.freetls.fastly.net",
            "https://images.fanart.tv",
            "https://assets.fanart.tv",
            "https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev",
            "wss://*.nomercy.tv:*",
          ],
          "connect-src": [
            "self",
            "blob:",
            "data:",
            "https://nomercy.tv",
            "https://*.nomercy.tv:*",
            "https://*.nomercy.tv",
            "https://*.spotify.com/*",
            "https://image.tmdb.org",
            "https://api.themoviedb.org",
            "https://www.last.fm",
            "ws://*.nomercy.tv:*",
            "ws://192.168.2.201:*",
            "wss://*.nomercy.tv:*",
            "wss://127.0.0.1:*",
            "wss://localhost:*",
            "https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev",
            "https://raw.githubusercontent.com",
            "https://o4509253570592768.ingest.de.sentry.io",
          ],
          "frame-src": [
            "self",
            "https://nomercy.tv",
            "https://*.nomercy.tv:*",
            "https://auth-dev.nomercy.tv",
            "https://auth-dev.nomercy.tv/*",
            "https://www.youtube.com",
          ],
          "font-src": [
            "self",
            "blob:",
            "data:",
            "https://cdn.nomercy.tv",
            "https://cdn-dev.nomercy.tv",
            "https://fonts.bunny.net",
          ],
          "media-src": [
            "self",
            "blob:",
            "data:",
            "https://nomercy.tv",
            "https://*.nomercy.tv",
            "https://*.nomercy.tv:*",
            "wss://*.nomercy.tv:*",
            "https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev",
          ],
          "worker-src": ["self", "blob:"],
        },
        {
          enabled: true,
          hashingMethod: "sha256",
          hashEnabled: {
            "script-src": false,
            "style-src": false,
            "script-src-attr": false,
            "style-src-attr": false,
          },
          nonceEnabled: {
            "script-src": false,
            "style-src": false,
          },
          // processFn: 'Nginx',
        }
      ),
      ViteMinifyPlugin(),
      // gzipPlugin(),
    ],
    server: {
      port: 5502,
      host: true,
      allowedHosts: ["app-dev.nomercy.tv"],
      headers: {
        "Cache-Control": "no-store",
      },
      fs: {
        strict: false,
      },
      middlewareMode: false,
      configureServer(server) {
        server.middlewares.use("/icons", (req, res, next) => {
          // Serve SVG icons from resources/icons for development
          if (
            req.url?.startsWith("/optimized/") ||
            req.url?.startsWith("/general/")
          ) {
            const iconName = req.url.split("/").pop();
            const iconPath = path.resolve(
              process.cwd(),
              "resources",
              "icons",
              iconName || ""
            );

            // Check if icon exists
            if (fs.existsSync(iconPath)) {
              res.setHeader("Content-Type", "image/svg+xml");
              res.setHeader("Cache-Control", "public, max-age=31536000");
              const iconContent = fs.readFileSync(iconPath, "utf8");
              res.end(iconContent);
              return;
            } else {
              // Return 404 for missing icons instead of SPA fallback
              res.statusCode = 404;
              res.setHeader("Content-Type", "text/plain");
              res.end("Icon not found");
              return;
            }
          }
          next();
        });
      },
    },
    preview: {
      port: 5502,
      host: true,
    },
    build: {
      outDir: "docs",
      sourcemap: false,
      assetsDir: "assets",
      chunkSizeWarningLimit: 500,
      emptyOutDir: true,
      minify: "esbuild",
      cssMinify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Only separate vendor libraries, let Vite handle app code chunking automatically
            if (id.includes("node_modules")) {
              // Heavy libraries get their own chunks
              if (id.includes("subtitles-octopus")) {
                return "subtitles-octopus";
              }
              if (id.includes("@nomercy-entertainment/nomercy-video-player")) {
                return "video-player";
              }
              if (id.includes("@nomercy-entertainment/nomercy-music-player")) {
                return "music-player";
              }
              if (id.includes("primevue") || id.includes("@primevue")) {
                return "primevue";
              }
              // Combine Vue and Ionic into a single chunk to avoid circular dependencies
              if (
                id.includes("@ionic") ||
                id.includes("vue") ||
                id.includes("@vue")
              ) {
                return "vue-ionic";
              }
              if (id.includes("chart.js")) {
                return "charts";
              }
              if (id.includes("swiper")) {
                return "swiper";
              }
              if (id.includes("rxjs")) {
                return "rxjs";
              }
              if (id.includes("axios") || id.includes("@tanstack")) {
                return "api";
              }
              if (id.includes("hls.js") || id.includes("m3u8-parser")) {
                return "media";
              }
              return "vendor";
            }

            // Let Vite handle all app code chunking automatically to avoid circular dependencies
            // All manual app chunking has been removed to prevent initialization errors

            // Only separate heavy assets like icons which are typically safe
            if (id.includes("resources/icons/")) {
              return "icons";
            }

            // Let Vite decide how to chunk the rest automatically
            return undefined;
          },
          generatedCode: {
            constBindings: true,
            arrowFunctions: true,
            objectShorthand: true,
            reservedNamesAsProps: false,
          },
          strict: false,
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          chunkFileNames: "assets/[name]-[hash].js",
        },
        external: (id) => {
          // Externalize heavy optional dependencies
          if (
            id.includes("subtitles-octopus") &&
            process.env.NODE_ENV === "production"
          ) {
            return false; // Keep for now, but could be made external
          }
          return false;
        },
      },
    },
    optimizeDeps: {
      include: [
        "vue",
        "@ionic/vue",
        "@ionic/vue-router",
        "vue-router",
        "@tanstack/vue-query",
        "axios",
      ],
      exclude: ["subtitles-octopus"],
      force: true,
      esbuildOptions: {
        minify: true,
        minifySyntax: true,
        minifyIdentifiers: true,
        minifyWhitespace: true,
        treeShaking: true,
        // splitting: true,
        format: "esm",
        sourcemap: false,
        dropLabels: ["DEV"],
        plugins: [],
        target: "es2020",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@Icons": path.resolve(__dirname, "./resources/icons"),
        downloadWorker: path.resolve(
          __dirname,
          "./src/lib/OfflineContentManager/downloadWorker"
        ),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    base: "/",
  };
});
