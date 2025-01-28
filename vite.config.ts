/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteCspPlugin } from 'vite-plugin-csp';
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import vue from '@vitejs/plugin-vue';

export default defineConfig({
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
		// legacy({
		// 	targets: ['chrome 100', 'firefox 100', 'safari 14', 'edge 100', 'not IE 11'],
		// 	additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
		// 	modernTargets: ['chrome 100', 'firefox 100', 'safari 14', 'edge 100'],
		// }),
		VitePWA({
			disable: process.env.NODE_ENV === 'development',
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			includeAssets: [
				"**/*",
			],
			workbox: {
				globPatterns: ["**/*"],
				maximumFileSizeToCacheInBytes: 50000000, // 50mb
				cleanupOutdatedCaches: true,
				skipWaiting: true,
				clientsClaim: true,
				sourcemap: true,
				runtimeCaching: [
					{
						urlPattern: /.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'nomercy-app-cache',
							expiration: {
								maxEntries: 1000,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/(?:cdn|storage|cdn-dev|app)\.nomercy\.tv\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'nomercy-assets',
							expiration: {
								maxEntries: 1000,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
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
				// display_override: ['standalone', 'minimal-ui'],
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
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-384x384.png',
						sizes: '384x384',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-256x256.png',
						sizes: '256x256',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-192x192.png',
						sizes: '192x192',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-144x144.png',
						sizes: '144x144',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-96x96.png',
						sizes: '96x96',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-72x72.png',
						sizes: '72x72',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-48x48.png',
						sizes: '48x48',
						purpose: 'any',
					},
					{
						src: '/img/icons/android-chrome-36x36.png',
						sizes: '36x36',
						purpose: 'any',
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
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: 'index.html',
			}
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
				'https://*.nomercy.tv',
				'https://vscode.nomercy.tv',
				'https://trailer.nomercy.tv',
				'https://*.nomercy.tv:*',
				'https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js',
				'https://www.gstatic.com',

				'sha256-G3Q1p4s6LacltrOf4BnWiwdl1rEp+mmS6DwpXr5fjKg=',
				'sha256-VA8O2hAdooB288EpSTrGLl7z3QikbWU9wwoebO/QaYk=',
				'sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=',
				'sha256-MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=',
				'sha256-tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=',
				'sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=',
				'sha256-XC/gbdknUrCiLbZdZ8y96M9KVODooJYGbxrY7P+a1Rg=',
				'https://static.cloudflareinsights.com',
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
		}, {
			enabled: true,
			hashingMethod: 'sha256',
			hashEnabled: {
				'script-src': true,
				'style-src': false,
				'script-src-attr': false,
				'style-src-attr': false,
			},
			nonceEnabled: {
				'script-src': false,
				'style-src': false,
			},
			processFn: 'Nginx',
		}),
		ViteMinifyPlugin(),
		// gzipPlugin(),
	],
	server: {
		port: 5502,
		host: true,
	},
	preview: {
		port: 5502,
		host: true,
	},
	build: {
		outDir: 'docs',
		sourcemap: true,
		chunkSizeWarningLimit: 102400,
		emptyOutDir: true,
		minify: 'esbuild',
		rollupOptions: {
			preserveEntrySignatures: 'exports-only',
			treeshake: 'recommended',
			output: {
				compact: true,
				esModule: true,
				minifyInternalExports: true,
				sanitizeFileName: true,
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
			sourcemap: true,
			dropLabels: ['DEV'],
			plugins: [],
			target: 'es2020',
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@Icons': path.resolve(__dirname, './resources/icons'),
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
});
