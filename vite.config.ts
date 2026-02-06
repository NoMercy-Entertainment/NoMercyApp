/// <reference types="vitest" />
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteCspPlugin } from 'vite-plugin-csp';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import compression from 'vite-plugin-compression';
import vue from '@vitejs/plugin-vue';

import { pwaConfig } from './pwaConfig';
import { cspConfig } from './cspConfig';

function getGitCommitHash(): string {
	try {
		return execSync('git rev-parse --short HEAD').toString().trim();
	} catch {
		return 'unknown';
	}
}

function versionJsonPlugin(commitHash: string, buildTime: string): Plugin {
	const handler = (_req: any, res: any) => {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		res.end(JSON.stringify({
			version: commitHash,
			buildTime,
			forceUpdate: false,
		}));
	};

	return {
		name: 'version-json',
		configureServer(server) {
			server.middlewares.use('/version.json', handler);
		},
		configurePreviewServer(server) {
			server.middlewares.use('/version.json', handler);
		},
	};
}

// @ts-ignore
export default defineConfig(({ command }) => {
	const commitHash = getGitCommitHash();
	const buildTime = new Date().toISOString();

	return {
		define: {
			__BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
			__BUILD_VERSION__: JSON.stringify(
				process.env.npm_package_version || '1.0.0',
			),
			__APP_VERSION__: JSON.stringify(commitHash),
			__BUILD_TIME__: JSON.stringify(buildTime),
		},
		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement: tag =>
							[
								'swiper-slide',
								// 'google-cast-launcher',
							].includes(tag),
					},
					transformAssetUrls: {
						// ...
					},
				},
			}),
			versionJsonPlugin(commitHash, buildTime),
			VitePWA(pwaConfig),
			ViteCspPlugin(cspConfig, {
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
			compression({ algorithm: 'gzip', ext: '.gz' }),
			compression({ algorithm: 'brotliCompress', ext: '.br' }),
		],
		server: {
			port: 5502,
			host: true,
			allowedHosts: ['app-dev.nomercy.tv'],
			headers: {
				'Cache-Control': 'no-store',
			},
			fs: {
				strict: true,
			},
			configureServer(server: {
				middlewares: { use: (arg0: string, arg1: (req: any, res: any, next: any) => void) => void };
			}) {
				server.middlewares.use('/icons', (req, res, next) => {
					// Serve SVG icons from resources/icons for development
					if (
						req.url?.startsWith('/optimized/')
						|| req.url?.startsWith('/general/')
					) {
						const iconName = req.url.split('/').pop();
						const iconPath = path.resolve(
							process.cwd(),
							'resources',
							'icons',
							iconName || '',
						);

						// Check if icon exists
						if (fs.existsSync(iconPath)) {
							res.setHeader('Content-Type', 'image/svg+xml');
							res.setHeader('Cache-Control', 'public, max-age=31536000');
							const iconContent = fs.readFileSync(iconPath, 'utf8');
							res.end(iconContent);
							return;
						}
						else {
							// Return 404 for missing icons instead of SPA fallback
							res.statusCode = 404;
							res.setHeader('Content-Type', 'text/plain');
							res.end('Icon not found');
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
			outDir: 'docs',
			sourcemap: false,
			assetsDir: 'assets',
			chunkSizeWarningLimit: 250,
			emptyOutDir: true,
			minify: 'esbuild',
			cssMinify: 'esbuild',
			cssCodeSplit: true,
			rollupOptions: {
				external: (id) => {
					if (
						id.includes('subtitles-octopus')
						&& process.env.NODE_ENV === 'production'
					) {
						return false;
					}
					return false;
				},
				output: {
					manualChunks(id: string) {
						if (id.includes('node_modules')) {
							if (id.includes('vue-router') || id.includes('/vue/')) {
								return 'vue-core';
							}
							if (id.includes('@ionic/vue') || id.includes('@ionic/vue-router') || id.includes('@ionic/core')) {
								return 'ionic';
							}
							if (id.includes('primevue') || id.includes('@primevue/themes') || id.includes('@primeuix/styled')) {
								return 'primevue';
							}
							if (id.includes('/swiper/')) {
								return 'swiper';
							}
							if (id.includes('@tanstack/vue-query')) {
								return 'query';
							}
							if (id.includes('i18next')) {
								return 'i18n';
							}
							if (id.includes('@microsoft/signalr')) {
								return 'signalr';
							}
							if (id.includes('/axios/') || id.includes('/clsx/') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
								return 'utils';
							}
						}
					},
					chunkFileNames: 'assets/[name]-[hash].js',
					assetFileNames: 'assets/[name]-[hash].[ext]',
				},
			},
		},
		optimizeDeps: {
			include: [
				'vue',
				'@ionic/vue',
				'@ionic/vue-router',
				'vue-router',
				'@tanstack/vue-query',
				'axios',
			],
			exclude: ['subtitles-octopus'],
			force: true,
			rollupOptions: {
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
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@Icons': path.resolve(__dirname, './resources/icons'),
				'downloadWorker': path.resolve(
					__dirname,
					'./src/lib/OfflineContentManager/downloadWorker',
				),
			},
		},
		css: {
			devSourcemap: false,
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
				},
			},
		},
		base: '/',
	};
});
