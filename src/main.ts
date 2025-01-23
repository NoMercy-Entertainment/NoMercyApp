import { createApp } from 'vue';
import { isPlatform } from '@ionic/vue';
import { App } from "@capacitor/app";
import WebKeycloak from '@dsb-norge/vue-keycloak-js';

import { isTv } from '@/config/global';
import { keycloakConfig } from '@/config/config';
import MobileKeycloak from '@/lib/auth/mobile-keycloak';
import TvKeycloak from '@/lib/auth/tv-keycloak';
import { lockPortrait } from '@/lib/utils';
import { setUserFromKeycloak } from '@/store/user';

let redirectUri = `nomercy://home`;
if (location.href.includes('logout')) {
	redirectUri = `nomercy:///logout`;
}
App.addListener('appUrlOpen', async (data) => {
	console.log('App opened with URL: ', data.url);
	redirectUri = data.url;
	router.isReady().then(async () => {
		await router.replace(data.url.replace('nomercy://', ''));
	});
}).then();

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
// import '@ionic/vue/css/palettes/dark.always.css';
// import '@ionic/vue/css/palettes/dark.class.css';
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import './theme/app.scss';

import 'swiper/css';
import 'swiper/element/css/keyboard';

import '@ionic/vue/css/ionic-swiper.css';

import AppComponent from './App.vue';
import router from "@/router";

const app = createApp(AppComponent);

const refreshToken = location.search.includes('refreshToken')
	? location.search.split('refreshToken=')[1].split('&')[0]
	: localStorage.getItem('refresh_token') || undefined;

const redirectUrl = window.location.hash.replace('#', '');
redirectUrl && localStorage.setItem('redirectUrl', redirectUrl);

// Mobile Capacitor App
if (isPlatform('capacitor') && !isTv.value && !localStorage.getItem('access_token')) {
	lockPortrait().then();
	// @ts-ignore
	app.use(MobileKeycloak, {
		init: {
			refreshToken: localStorage.getItem('refresh_token') || undefined,
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			adapter: 'capacitor-native',
			responseMode: 'query',
			redirectUri: `nomercy://home`,
		},
		config: keycloakConfig,
		onReady: (data) => {
			setUserFromKeycloak(data as any);

			import('./setupApp').then(({ setupApp }) => setupApp(app));
		}
	});
}
// Regular Web App
else if (!isPlatform('capacitor') && !location.search.includes('refreshToken')) {
	app.use(WebKeycloak, {
		init: {
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			responseMode: 'query',
			redirectUri: `${window.location.href || '#/'}${window.location.hash.includes('?') ? '' : '?'}`,
		},
		config: keycloakConfig,
		onReady: (data) => {
			setUserFromKeycloak(data as any);

			import('./setupApp').then(({ setupApp }) => setupApp(app));
		}
	});
}
// Cast Web App
else if (!isPlatform('capacitor') && location.search.includes('refreshToken')) {
	app.use(TvKeycloak, {
		initOptions: {
			refreshToken: refreshToken,
			onLoad: 'check-sso',
			checkLoginIframe: false,
			enableLogging: true,
			pkceMethod: 'S256',
			silentCheckSsoFallback: true,
			redirectUri: `${window.location.href || '#/'}${window.location.hash.includes('?') ? '' : '?'}`,
		},
		config: keycloakConfig,
	});

	location.href = "nomercy://home";

	import('./setupApp').then(({ setupApp }) => setupApp(app));
}
// TV App
else {
	app.use(TvKeycloak, {
		initOptions: {
			refreshToken: localStorage.getItem('refresh_token') || undefined,
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			adapter: 'cordova-native',
			responseMode: 'query',
			redirectUri: redirectUri,
			pkceMethod: 'S256',
			silentCheckSsoFallback: true,
		},
		config: keycloakConfig,
	});

	import('./setupApp').then(({ setupApp }) => setupApp(app));
}
