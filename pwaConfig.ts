import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa';
import type { GenerateSWOptions } from 'workbox-build';
import { env } from 'node:process';

const manifest = {
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
		'fullscreen',
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
} satisfies Partial<ManifestOptions>;

const workbox = {
	cleanupOutdatedCaches: true,
	clientsClaim: true,
	sourcemap: false,
	skipWaiting: false, // Don't auto-skip - let user control when to update
	mode: env.NODE_ENV === 'production' ? 'production' : 'development',
	dontCacheBustURLsMatching: /\.\w{8}\./,
	navigateFallback: 'index.html',
	navigateFallbackDenylist: [
		/^\/_/, // Private paths
		/\/[^/?][^./?]*\.[^/]+$/, // Files with extensions
		/\.(?:js|css|html|ico|png|svg|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|xml|txt)$/i, // Asset extensions
		/^\/icons\/optimized\/.*\.svg$/i, // Icon optimization service URLs
		/^\/icons\/general\/.*\.svg$/i, // Icon fallback URLs
	],
	maximumFileSizeToCacheInBytes: 25 * 1024 * 1024 * 1024, // 25GB per item
	runtimeCaching: [
		// DEV ENVIRONMENT: Skip caching app files for local IPs and dev subdomains
		{
			urlPattern: ({ url }) => {
				const isLocalIP
					= /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?/.test(
						url.href,
					);
				const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
					url.hostname,
				);
				const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
					url.hostname,
				);
				const isAppFile
					= url.pathname.match(/\.(js|css|html|json|xml|txt)$/i)
						|| url.pathname === '/'
						|| url.pathname.startsWith('/assets/')
						|| !url.pathname.includes('.');

				// Skip caching for Vue app files in dev environment
				return (isLocalIP || isDevSubdomain) && isAppFile && !isApiServer;
			},
			handler: 'NetworkOnly',
			options: {
				cacheName: 'dev-no-cache',
			},
		},

		// DEV ENVIRONMENT: Cache static assets (fonts, images) even from local/dev sources
		{
			urlPattern: ({ url }) => {
				const isLocalIP
					= /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?/.test(
						url.href,
					);
				const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
					url.hostname,
				);
				const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
					url.hostname,
				);
				const isAssetFile = url.pathname.match(
					/\.(png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot|svg|ico)$/i,
				);

				return (isLocalIP || isDevSubdomain) && isAssetFile && !isApiServer;
			},
			handler: 'CacheFirst',
			options: {
				cacheName: 'nomercy-fonts-v5', // Updated version for cache invalidation
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
					/\.(?:woff2?|ttf|eot)$/i.test(url.pathname)
					|| url.pathname.includes('/fonts/')
				);
			},
			handler: 'CacheFirst',
			options: {
				cacheName: 'nomercy-fonts-v5',
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
				const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
					url.hostname,
				);
				return /\.(?:jpg|jpeg|png|gif|webp|avif|svg)$/i.test(
					url.pathname,
				) && !isApiServer;
			},
			handler: 'CacheFirst',
			options: {
				cacheName: 'nomercy-images-v5',
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
		// {
		// 	urlPattern: ({ url }) => {
		// 		const isLocalIP
		// 			= /^https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?/.test(
		// 				url.href,
		// 			);
		// 		const isDevSubdomain = /(?:^|\.)dev\.nomercy\.tv$/.test(
		// 			url.hostname,
		// 		);
		// 		const isStaticAsset = /\.(?:js|css|json)$/i.test(url.pathname);
		//
		// 		// Only cache static assets from production sources
		// 		return !isLocalIP && !isDevSubdomain && isStaticAsset;
		// 	},
		// 	handler: 'CacheFirst',
		// 	options: {
		// 		cacheName: 'nomercy-static-v5',
		// 		expiration: {
		// 			maxEntries: 1000,
		// 			maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
		// 		},
		// 		cacheableResponse: {
		// 			statuses: [0, 200],
		// 		},
		// 	},
		// },

		// API REQUESTS: Stale-while-revalidate strategy (matches enhanced-sw API_CACHE)
		{
			urlPattern: ({ url }) => {
				return /^api.nomercy\.tv/.test(url.hostname);
			},
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'nomercy-api-v5',
				expiration: {
					maxEntries: 1000,
					maxAgeSeconds: 5 * 60, // 5 minutes
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
				backgroundSync: {
					name: 'nomercy-api-v5',
					options: { forceSyncFallback: true },
				},
			},
		},

		// NOMERCY CDN: Cache first for CDN assets
		{
			urlPattern: /^https:\/\/(cdn|storage|cdn-dev)\.nomercy\.tv\/.*/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'nomercy-cdn-v5',
				expiration: {
					maxEntries: 10000,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
				backgroundSync: {
					name: 'nomercy-cdn-v5',
					options: { forceSyncFallback: true },
				},
			},
		},

		// COVER IMAGES: Specific pattern for API server images
		{
			urlPattern: ({ url }) => {
				const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
					url.hostname,
				);
				const isImageRequest = url.pathname.match(
					/\/images\/.*?\.(jpg|jpeg|png|gif|webp|avif)$/i,
				);
				return isApiServer && isImageRequest;
			},
			handler: 'CacheFirst',
			options: {
				cacheName: 'nomercy-cover-images-v5',
				expiration: {
					maxEntries: 100000,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
				backgroundSync: {
					name: 'nomercy-cover-images-v5',
					options: { forceSyncFallback: true },
				},
			},
		},

		// NOMERCY APP: Network first for main app
		{
			urlPattern: /^https:\/\/app\.nomercy\.tv\/.*/i,
			handler: 'NetworkFirst',
			options: {
				cacheName: 'nomercy-app-v5',
				expiration: {
					maxEntries: 1000,
					maxAgeSeconds: 24 * 60 * 60, // 1 day
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
				backgroundSync: {
					name: 'nomercy-app-v5',
					options: { forceSyncFallback: true },
				},
			},
		},

		// DYNAMIC CONTENT: Default handler for other requests
		// {
		// 	urlPattern: ({ url }) => {
		// 		const isApiServer = /^[^.]+\.[^.]+\.nomercy\.tv/.test(
		// 			url.hostname,
		// 		);
		// 		// Catch-all for navigation and other requests (not already handled)
		// 		return (
		// 			!url.pathname.startsWith('/api/')
		// 			&& !url.pathname.startsWith('/auth/')
		// 			&& !isApiServer
		// 			&& !url.pathname.match(
		// 				/\.(js|css|json|woff2?|ttf|eot|jpg|jpeg|png|gif|webp|avif|svg)$/i,
		// 			)
		// 		);
		// 	},
		// 	handler: 'NetworkFirst',
		// 	options: {
		// 		cacheName: 'nomercy-dynamic-v5',
		// 		expiration: {
		// 			maxEntries: 1000,
		// 			maxAgeSeconds: 24 * 60 * 60, // 1 day
		// 		},
		// 		cacheableResponse: {
		// 			statuses: [0, 200],
		// 		},
		// 		networkTimeoutSeconds: 3,
		// 	},
		// },
	],
} satisfies Partial<GenerateSWOptions>;

export const pwaConfig = {
	strategies: 'generateSW',
	registerType: 'prompt',
	workbox,
	manifest,
	devOptions: {
		enabled: false,
		type: 'module',
		navigateFallback: 'index.html',
		suppressWarnings: false,
	},
	injectRegister: 'script',
} satisfies Partial<VitePWAOptions>;
