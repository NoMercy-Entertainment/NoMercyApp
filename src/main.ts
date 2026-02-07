import { setupChunkErrorRecovery } from '@/lib/chunkErrorRecovery';
import { runCacheMigration } from '@/lib/cacheMigration';
import { createApp, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import AppComponent from './App.vue';

// Set up chunk error recovery immediately (before any dynamic imports can fail)
setupChunkErrorRecovery();

// Register controllerchange listener early so any SKIP_WAITING triggers a reload
if ('serviceWorker' in navigator) {
	let refreshing = false;
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (!refreshing) {
			refreshing = true;
			window.location.reload();
		}
	});
}

// Lazy imports - these will be loaded when needed
const lazyImports = {
	App: () => import('@capacitor/app'),
	router: () => import('@/router'),
	deviceInfo: () => import('@/store/deviceInfo'),
	utils: () => import('@/lib/utils'),
	user: () => import('@/store/user'),
	routeState: () => import('@/store/routeState'),
	preloadService: () => import('@/services/PreloadService'),
};

const app = createApp(AppComponent);

lazyImports.deviceInfo().then();

// Initialize preloading service (non-blocking)
lazyImports.preloadService().then(({ preloadService }) => preloadService.init());

async function setupApplication() {
	const { setupApp } = await import('./setupApp');
	return setupApp(app);
}

async function initializeWebApp() {
	const { redirectUrl } = await lazyImports.routeState();
	redirectUrl.value = window.location.pathname;

	if (!isPlatform('capacitor') && !location.search.includes('refreshToken')) {
		const [keycloak, configModule, { setUserFromWebKeycloak }] = await Promise.all([
			import('@josempgon/vue-keycloak'),
			import('@/config/config'),
			lazyImports.user(),
		]);

		app.use(keycloak.vueKeycloak, {
			initOptions: {
				onLoad: 'login-required',
				checkLoginIframe: false,
				enableLogging: true,
				responseMode: 'query',
				redirectUri: `${window.location.href || '#/'}${
					window.location.hash.includes('?') ? '' : '?'
				}`,
			},
			config: configModule.keycloakConfig,
		});

		const kc = keycloak.useKeycloak();
		watch(kc.decodedToken, async () => {
			setUserFromWebKeycloak(kc);
			await setupApplication();

			// After Keycloak redirect completes, apply any pending update
			const { checkAndApplyPendingUpdate } = await import('@/lib/auth/updateState');
			checkAndApplyPendingUpdate();
		});
	}
}

// Run one-time cache migration for existing users, then start the application
runCacheMigration().then(async () => {
	// Run initial version check early and BLOCK app init if outdated
	// This prevents loading stale chunks that will 404
	if (!import.meta.env.DEV) {
		try {
			const { checkForUpdates } = await import('@/lib/versionCheck');
			const isOutdated = await checkForUpdates();
			if (isOutdated) {
				// checkForUpdates already triggered forceUpdate/notification
				// Don't proceed with loading stale chunks
				return;
			}
		}
		catch {
			// Version check failed (network error, etc.) — continue with app init
		}
	}
	initializeWebApp();
});
