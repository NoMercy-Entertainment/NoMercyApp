/// <reference types="vitest" />
import path from 'path';

import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {ViteCspPlugin} from 'vite-plugin-csp';
import {ViteMinifyPlugin} from 'vite-plugin-minify'
import vue from '@vitejs/plugin-vue';

// @ts-ignore
export default defineConfig(({command}) => {

    return {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => [
                            // 'google-cast-launcher',
                        ].includes(tag),
                    },
                    transformAssetUrls: {
                        // ...
                    },

                },
            }),
            VitePWA({
                registerType: 'autoUpdate',
                strategies: 'generateSW',
                workbox: {
                    cleanupOutdatedCaches: true,
                    clientsClaim: true,
                    skipWaiting: true,
                    sourcemap: false,
                    // 		globPatterns: [
                    // 			'**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,json}',
                    // 		],
                    // 		globIgnores: ['**/*.webmanifest'],
                    navigateFallback: 'index.html',
                    runtimeCaching: [
                        {
                            urlPattern: /^https:\/\/app\.nomercy\.tv\/.*/i,
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'static-assets-v3',
                                fetchOptions: {
                                    mode: 'cors',
                                    credentials: 'same-origin',
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                },
                                backgroundSync: {
                                    name: 'static-assets-v3',
                                    options: {forceSyncFallback: true}
                                }
                            }
                        },
                        {
                            urlPattern: /^https:\/\/(cdn|storage|cdn-dev)\.nomercy\.tv\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'cdn-assets-v3',
                                expiration: {
                                    maxEntries: 1000,
                                    maxAgeSeconds: 60 * 60 * 24 * 30
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                },
                                backgroundSync: {
                                    name: 'cdn-assets-v3',
                                    options: {forceSyncFallback: true}
                                }
                            }
                        },
                        {
                            urlPattern: ({url}) => {
                                return /^api.nomercy\.tv/.test(url.hostname);
                            },
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'nomercy-api-v3',
                                cacheableResponse: {
                                    statuses: [0, 200]
                                },
                                backgroundSync: {
                                    name: 'nomercy-api-v3',
                                    options: {forceSyncFallback: true}
                                }
                            }
                        },
                        {
                            // this should match urls like https://192-168-2-123.123abc-1234abc-123abc-123abc.nomercy.tv:7626/images
                            urlPattern: ({url}) => {
                                const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(url.hostname);
                                const isImageRequest = url.pathname.match(/\/images\/.*?\.(jpg|jpeg|png|gif|webp|avif)$/i);
                                return isApiServer && isImageRequest;
                            },
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'cover-images-v1',
                                expiration: {
                                    maxEntries: 100000,
                                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                },
                                backgroundSync: {
                                    name: 'cover-images-v1',
                                    options: {forceSyncFallback: true}
                                }
                            }
                        },
                    ],
                    maximumFileSizeToCacheInBytes: 25 * 1024 * 1024 * 1024, // 25GB per item
                },
                manifest: {
                    name: 'NoMercy TV',
                    short_name: 'NoMercy TV',
                    description:
                        'Encode and archive all your movies and tv show\'s, and play them on all your devices.',
                    categories: [
                        'video',
                        'encoder',
                        'player',
                        'library',
                        'nomercy',
                        'server',
                    ],
                    theme_color: '#000000',
                    background_color: '#000000',
                    display: 'standalone',
                    orientation: 'any',
                    scope: '/',
                    start_url: '/',
                    display_override: [
                        'standalone',
                        'window-controls-overlay',
                        'fullscreen'
                    ],
                    iarc_rating_id: '6',
                    id: 'tv.nomercy.app',
                    protocol_handlers: [
                        {
                            protocol: 'web+nomercy',
                            url: '/%s',
                        },
                    ],
                    prefer_related_applications: true,
                    icons: [
                        {
                            src: '/img/icons/android-chrome-512x512.png',
                            sizes: '512x512',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-512x512.png',
                            sizes: '512x512',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-384x384.png',
                            sizes: '384x384',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-256x256.png',
                            sizes: '256x256',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-192x192.png',
                            sizes: '192x192',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-144x144.png',
                            sizes: '144x144',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-96x96.png',
                            sizes: '96x96',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-72x72.png',
                            sizes: '72x72',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-48x48.png',
                            sizes: '48x48',
                            purpose: 'maskable',
                        },
                        {
                            src: '/img/icons/android-chrome-36x36.png',
                            sizes: '36x36',
                            purpose: 'maskable',
                        },
                    ],
                    screenshots: [],
                    shortcuts: [
                        {
                            name: 'Home',
                            short_name: 'Home',
                            url: '/',
                            icons: [
                                {
                                    src: '/img/icons/android-chrome-192x192.png',
                                    sizes: '192x192',
                                    type: 'image/png',
                                    purpose: 'any',
                                },
                            ],
                        },
                    ],
                },
                base: '/',
                // 	devOptions: {
                // 		enabled: false,
                // 		type: 'module',
                // 		navigateFallback: 'index.html',
                // 		suppressWarnings: false,
                // 	},
            }),
            ViteCspPlugin({
                    'base-uri': [
                        'self',
                    ],
                    'object-src': [
                        'self',
                        'blob:',
                    ],
                    'script-src': [
                        'self',
                        'unsafe-eval',
                        'unsafe-inline',
                        'unsafe-hashes',
                        'https://www.youtube.com',
                        'https://nomercy.tv',
                        'http://localhost:5503',
                        'https://*.nomercy.tv',
                        'https://vscode.nomercy.tv',
                        'https://trailer.nomercy.tv',
                        'https://*.nomercy.tv:*',
                        'https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js',
                        'https://www.gstatic.com',
                        'https://static.cloudflareinsights.com',
                    ],
                    'style-src-attr': [
                        'unsafe-inline'
                    ],
                    'style-src': [
                        'self',
                        'unsafe-inline',
                        'unsafe-eval',
                        'https://cdn.nomercy.tv',
                        'https://cdn-dev.nomercy.tv',
                        'https://storage.nomercy.tv',
                    ],
                    'img-src': [
                        'self',
                        'blob:',
                        'data:',
                        'https://nomercy.tv',
                        'https://*.nomercy.tv:*',
                        'https://*.nomercy.tv',
                        'https://*.spotify.com/*',
                        'https://*.archive.org',
                        'https://archive.org',
                        'https://coverartarchive.org',
                        'https://i.ytimg.com',
                        'https://image.tmdb.org',
                        'https://media.themoviedb.org',
                        'https://lastfm.freetls.fastly.net',
                        'https://images.fanart.tv',
                        'https://assets.fanart.tv',
                        'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev',
                        'wss://*.nomercy.tv:*',
                    ],
                    'connect-src': [
                        'self',
                        'blob:',
                        'data:',
                        'https://nomercy.tv',
                        'https://*.nomercy.tv:*',
                        'https://*.nomercy.tv',
                        'https://*.spotify.com/*',
                        'https://image.tmdb.org',
                        'https://api.themoviedb.org',
                        'https://www.last.fm',
                        'ws://*.nomercy.tv:*',
                        'ws://192.168.2.201:*',
                        'wss://*.nomercy.tv:*',
                        'wss://127.0.0.1:*',
                        'wss://localhost:*',
                        'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev',
                        'https://raw.githubusercontent.com',
                        'https://o4509253570592768.ingest.de.sentry.io',
                    ],
                    'frame-src': [
                        'self',
                        'https://nomercy.tv',
                        'https://*.nomercy.tv:*',
                        'https://auth-dev.nomercy.tv',
                        'https://auth-dev.nomercy.tv/*',
                        'https://www.youtube.com',
                    ],
                    'font-src': [
                        'self',
                        'blob:',
                        'data:',
                        'https://cdn.nomercy.tv',
                        'https://cdn-dev.nomercy.tv',
                    ],
                    'media-src': [
                        'self',
                        'blob:',
                        'data:',
                        'https://nomercy.tv',
                        'https://*.nomercy.tv',
                        'https://*.nomercy.tv:*',
                        'wss://*.nomercy.tv:*',
                        'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev',
                    ],
                    'worker-src': [
                        'self',
                        'blob:',
                    ],
                },
                {
                    enabled: true,
                    hashingMethod: 'sha256',
                    hashEnabled: {
                        'script-src': false,
                        'style-src': false,
                        'script-src-attr': false,
                        'style-src-attr': false,
                    },
                    nonceEnabled: {
                        'script-src': false,
                        'style-src': false,
                    },
                    // processFn: 'Nginx',
                }),
            ViteMinifyPlugin(),
            // gzipPlugin(),
        ],
        server: {
            port: 5502,
            host: true,
            allowedHosts: [
                'app-dev.nomercy.tv',
            ],
            headers: {
                'Cache-Control': 'no-store',
            },
            fs: {
                strict: false
            }
        },
        preview: {
            port: 5502,
            host: true,
        },
        build: {
            outDir: 'docs',
            sourcemap: false,
            assetsDir: 'assets',
            chunkSizeWarningLimit: 102400,
            emptyOutDir: true,
            minify: 'esbuild',
            cssMinify: "esbuild",
            rollupOptions: {
                output: {
                    // manualChunks: (id) => {
                    // 	if (id.includes('node_modules')) {
                    // 		return 'node_modules';
                    // 	}
                    // 	return 'app';
                    // },
                    generatedCode: {
                        preset: 'es5',
                        constBindings: true,
                        arrowFunctions: false,
                        objectShorthand: false,
                        reservedNamesAsProps: false,
                    },
                    strict: false,
                    entryFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                    chunkFileNames: 'assets/[name]-[hash].js',
                },
            },
        },
        optimizeDeps: {
            force: true,
            esbuildOptions: {
                minify: true,
                minifySyntax: true,
                minifyIdentifiers: true,
                minifyWhitespace: true,
                treeShaking: true,
                // splitting: true,
                format: 'esm',
                sourcemap: false,
                dropLabels: ['DEV'],
                plugins: [],
                target: 'es2020',
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@Icons': path.resolve(__dirname, './resources/icons'),
                'downloadWorker': path.resolve(__dirname, './src/lib/OfflineContentManager/downloadWorker'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
        base: '/',
    }
});
