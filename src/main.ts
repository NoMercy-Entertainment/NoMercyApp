// @ts-nocheck
import {createApp, toRaw} from 'vue';
import App from './App.vue';
import router from './router';

import {IonicVue, isPlatform} from '@ionic/vue';

import I18NextVue from 'i18next-vue';
import i18next from '@/config/i18next';

import VueKeycloakJs from '@/lib/vue-keycloak-js';
import VueKeycloak from '@dsb-norge/vue-keycloak-js';
import {VueQueryPlugin} from '@tanstack/vue-query';
import KonamiCode from 'vue3-konami-code';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import '@/store/deviceInfo';

import {setUserFromKeycloak} from '@/store/user';

import {setColorScheme} from '@/store/colorScheme';
import '@/lib/scrollHandlers';

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
import konamiEnabled from '@/store/konami';

import './theme/app.scss';
import {suffix} from '@/config/config';

import 'swiper/css';
import 'swiper/element/css/keyboard';
import {lockPortrait} from '@/lib/utils';

window.setColorScheme = setColorScheme;

declare global {
	interface Console {
		raw: (...arg: any) => void;
	}
}

console.raw = (...arg: any[]) => {
	console.log(...arg.map(a => toRaw(a)));
};

const app = createApp(App);

app.use(IonicVue);

app.use(I18NextVue, {
	i18next: i18next,
	rerenderOn: ['languageChanged', 'loaded'],
});

const keycloakConfig = {
	clientId: 'nomercy-ui',
	realm: 'NoMercyTV',
	url: `https://auth${suffix}.nomercy.tv`,
};

if (isPlatform('capacitor')) {
	lockPortrait().then();
	// @ts-ignore
	app.use(VueKeycloakJs, {
		init: {
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			adapter: 'capacitor-native',
			responseMode: 'fragment',
			redirectUri: 'nomercy://home',
		},
		config: keycloakConfig,
		onReady: (data) => {
			setUserFromKeycloak(data as any);
			app.use(router);
		}
	});
} else {
	app.use(VueKeycloak, {
		init: {
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			redirectUri: `${window.location.origin}/${localStorage.getItem('hash') || '#'}`,
		},
		config: keycloakConfig,
		onReady: (data) => {
			setUserFromKeycloak(data as any);
			app.use(router);
		}
	});
}

app.use(VueQueryPlugin);
app.use(PrimeVue, {
	theme: {
		preset: Aura,
	},
	ripple: true,
	options: {
		prefix: 'p',
		darkModeSelector: 'system',
		cssLayer: false,
	}

});

app.use(KonamiCode, {
	onKonamiCodeEntered: () => {
		konamiEnabled.value = !konamiEnabled.value;
	},
});

router.isReady()
	.then(() => {
		app.mount('#app');
	});
