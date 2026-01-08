import { createApp, watch } from 'vue';
import { isPlatform } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/app.scss';

import 'swiper/css';
import 'swiper/element/css/keyboard';

import AppComponent from './App.vue';
import { useOnline } from '@vueuse/core';
import { pwaMessages } from './i18n/pwa';

// Lazy imports - these will be loaded when needed
const lazyImports = {
	App: () => import('@capacitor/app'),
	StatusBar: () => import('@capacitor/status-bar'),
	NavigationBar: () => import('@hugotomazi/capacitor-navigation-bar'),
	EdgeToEdge: () => import('@capawesome/capacitor-android-edge-to-edge-support'),
	router: () => import('@/router'),
	deviceInfo: () => import('@/store/deviceInfo'),
	utils: () => import('@/lib/utils'),
	user: () => import('@/store/user'),
	routeState: () => import('@/store/routeState'),
	preloadService: () => import('@/services/PreloadService'),
	authHelpers: () => import('./lib/auth/helpers'),
	Sentry: () => import('@sentry/vue'),
};

function getCurrentLanguage(): string {
	return (
		localStorage.getItem('language') || navigator.language.split('-')[0] || 'en'
	);
}

const lang = getCurrentLanguage();
const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

const app = createApp(AppComponent);
const onlineStatus = useOnline();

// Initialize device info store early (but lazily)
lazyImports.deviceInfo().then();

// Initialize preloading service (non-blocking)
lazyImports.preloadService().then(({ preloadService }) => preloadService.init());

async function setupApplication() {
	const { setupApp } = await import('./setupApp');
	return setupApp(app);
}

async function initializeOfflineApp() {
	if (!onlineStatus.value) {
		const accessToken = localStorage.getItem('access_token');

		if (accessToken) {
			const [{ parseToken }, { setUser, user }] = await Promise.all([
				lazyImports.authHelpers(),
				lazyImports.user(),
			]);

			const tokenParsed = parseToken(accessToken);

			setUser({
				...user.value,
				name: tokenParsed.display_name,
				email: tokenParsed.email,
				id: tokenParsed.sub,
				accessToken,
				locale: tokenParsed.locale,
				moderator: tokenParsed.realm_access.roles.includes('nova'),
			});

			await setupApplication();
		}
		else {
			document.body.innerHTML = `
              <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
                <h1>${messages.offline}</h1>
                <p>${messages.offlineMessage}</p>
                <button onclick="location.reload()">${messages.reload}</button>
              </div>
            `;
		}
	}
}

async function initializeMobileApp() {
	if (
		isPlatform('capacitor')
		&& !localStorage.getItem('access_token')
	) {
		// Load all capacitor plugins in parallel
		const [
			{ lockPortrait },
			{ setUserFromKeycloak },
			{ StatusBar },
			{ NavigationBar },
			{ EdgeToEdge },
			MobileKeycloak,
			configModule,
		] = await Promise.all([
			lazyImports.utils(),
			lazyImports.user(),
			lazyImports.StatusBar(),
			lazyImports.NavigationBar(),
			lazyImports.EdgeToEdge(),
			import('@/lib/auth/mobile-keycloak').then(m => m.default),
			import('@/config/config').then(m => m.keycloakConfig),
		]);

		// Expose to window for debugging (non-blocking)
		Object.assign(window, { StatusBar, NavigationBar, EdgeToEdge });

		await lockPortrait();

		// Run status bar setup in parallel
		await Promise.all([
			StatusBar.show(),
			NavigationBar.show(),
			EdgeToEdge.enable(),
			EdgeToEdge.setBackgroundColor({ color: '#000000' }),
		]);

		// @ts-ignore
		app.use(MobileKeycloak, {
			init: {
				refreshToken: localStorage.getItem('refresh_token') || undefined,
				onLoad: 'login-required',
				checkLoginIframe: false,
				enableLogging: true,
				adapter: 'capacitor-native',
				responseMode: 'query',
				redirectUri: 'nomercy://home',
			},
			config: configModule,
			onReady: async (data: any) => {
				setUserFromKeycloak(data);
				await setupApplication();
			},
		});
	}
}

async function initializeWebApp() {
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
		});
	}
}

// Setup deep linking listener (non-blocking)
async function setupDeepLinking() {
	const [{ App }, router] = await Promise.all([
		lazyImports.App(),
		lazyImports.router(),
	]);

	const { redirectUrl } = await lazyImports.routeState();
	redirectUrl.value = window.location.pathname;

	App.addListener('appUrlOpen', async (data) => {
		router.default.isReady().then(async () => {
			await router.default.replace(data.url.replace('nomercy://', ''));
		});
	});
}

// Main initialization logic
async function initialize() {
	try {
		// Start deep linking setup in background
		setupDeepLinking();

		if (!onlineStatus.value) {
			await initializeOfflineApp();
		}
		else if (
			isPlatform('capacitor')
			&& !localStorage.getItem('access_token')
		) {
			await initializeMobileApp();
		}
		else if (
			!isPlatform('capacitor')
			&& !location.search.includes('refreshToken')
		) {
			await initializeWebApp();
		}
	}
	catch (error) {
		console.error('Failed to initialize app:', error);
		location.reload();
	}
}

// Start the application
initialize();

// Initialize Sentry in production (deferred, non-blocking)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
	requestIdleCallback(async () => {
		const Sentry = await lazyImports.Sentry();
		Sentry.init({
			app,
			dsn: import.meta.env.VITE_SENTRY_DSN,
			sendDefaultPii: false,
			tracesSampleRate: 0.1,
		});
	});
}
