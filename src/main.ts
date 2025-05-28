import { createApp } from 'vue';
import { isPlatform } from '@ionic/vue';
import { App } from "@capacitor/app";
import WebKeycloak from '@dsb-norge/vue-keycloak-js';

import { isTv } from '@/config/global';
import { keycloakConfig } from '@/config/config';
import MobileKeycloak from '@/lib/auth/mobile-keycloak';
import TvKeycloak from '@/lib/auth/tv-keycloak';
import { lockPortrait } from '@/lib/utils';
import { setUserFromKeycloak, user } from '@/store/user';

import * as Sentry from '@sentry/vue';

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
import { parseToken } from './lib/auth/helpers';
import { useOnline } from '@vueuse/core';

import { pwaMessages } from './i18n/pwa';

function getCurrentLanguage(): string {
	return localStorage.getItem('language') ||
		navigator.language.split('-')[0] ||
		'en';
}

const lang = getCurrentLanguage();
const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

const app = createApp(AppComponent);

const refreshToken = location.search.includes('refreshToken')
	? location.search.split('refreshToken=')[1].split('&')[0]
	: localStorage.getItem('refresh_token') || undefined;

const redirectUrl = window.location.hash.replace('#', '');
redirectUrl && localStorage.setItem('redirectUrl', redirectUrl);

const onlineStatus = useOnline();

if (!onlineStatus.value) {
	const accessToken = localStorage.getItem('access_token');

	if (accessToken) {

		const tokenParsed = parseToken(accessToken);

		user.value = {
			...user.value,
			name: tokenParsed.display_name,
			email: tokenParsed.email,
			id: tokenParsed.sub,
			accessToken: accessToken,
			locale: tokenParsed.locale,
			moderator: tokenParsed.realm_access.roles.includes('nova'),
		}

		import('./setupApp').then(({ setupApp }) => setupApp(app));

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
else {
	// Mobile Capacitor App
	if (isPlatform('capacitor') && !isTv.value && !localStorage.getItem('access_token')) {

		if (!sessionStorage.getItem('load') && isPlatform('capacitor')) {
			setTimeout(() => {
				sessionStorage.setItem('load', 'true');
				location.reload();
			}, 10);
		}

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
}

// Sentry.init({
// 	app,
// 	dsn: import.meta.env.VITE_SENTRY_DSN,
// 	// Setting this option to true will send default PII data to Sentry.
// 	// For example, automatic IP address collection on events
// 	sendDefaultPii: false
// });
