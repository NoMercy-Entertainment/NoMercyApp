import { createApp } from 'vue';
import { isPlatform } from '@ionic/vue';
import {App} from "@capacitor/app";
import WebKeycloak from '@dsb-norge/vue-keycloak-js';

import { isTv } from '@/config/global';
import { keycloakConfig } from '@/config/config';
import MobileKeycloak from '@/lib/auth/mobile-keycloak';
import TvKeycloak from '@/lib/auth/tv-keycloak';
import { lockPortrait } from '@/lib/utils';
import { setUserFromKeycloak } from '@/store/user';

import AppComponent from './App.vue';
import router from "@/router";

const app = createApp(AppComponent);

const refreshToken = location.search.includes('refreshToken')
	? location.search.split('refreshToken=')[1].split('&')[0]
	: localStorage.getItem('refresh_token') || undefined;

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
	let redirectUri = `nomercy://home`;
	if (location.href.includes('logout')) {
		redirectUri = `nomercy:///logout`;
	}

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

(async () => {
	await App.addListener('appUrlOpen', async (data) => {
		await router.replace(data.url.replace('nomercy://', ''));
	});
})();