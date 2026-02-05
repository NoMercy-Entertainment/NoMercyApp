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

import AppComponent from './App.vue';

// Lazy imports - these will be loaded when needed
const lazyImports = {
	App: () => import('@capacitor/app'),
	router: () => import('@/router'),
	deviceInfo: () => import('@/store/deviceInfo'),
	utils: () => import('@/lib/utils'),
	user: () => import('@/store/user'),
	routeState: () => import('@/store/routeState'),
	preloadService: () => import('@/services/PreloadService'),
	Sentry: () => import('@sentry/vue'),
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
		});
	}
}

// Start the application
initializeWebApp().then();

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
