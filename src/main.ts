// @ts-nocheck
// eslint-disable vue/multi-word-component-names
import {createApp, toRaw} from 'vue';
import AppComponent from './App.vue';
import router from './router';

import {App} from '@capacitor/app';
import {IonicVue, isPlatform, useBackButton} from '@ionic/vue';

import I18NextVue from 'i18next-vue';
import i18next from '@/config/i18next';

import WebKeycloak from '@dsb-norge/vue-keycloak-js';
import MobileKeycloak from '@/lib/auth/mobile-keycloak';
import TvKeycloak from '@/lib/auth/tv-keycloak';

import {VueQueryPlugin} from '@tanstack/vue-query';
import KonamiCode from 'vue3-konami-code';
import {keycloakConfig} from '@/config/config';
import {queryClient} from '@/config/tanstack-query';
import {isTv} from '@/config/global';

import {lockPortrait} from '@/lib/utils';

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

import 'swiper/css';
import 'swiper/element/css/keyboard';

import '@ionic/vue/css/ionic-swiper.css';
import Button from '@/components/Buttons/Button.vue';
import HomeCard from '@/components/NMHomeCard.vue';
import Modal from '@/components/Modal.vue';
import NMCard from '@/components/NMCard.vue';
import NMCarousel from '@/components/NMCarousel.vue';
import NMContainer from '@/components/NMContainer.vue';
import NMList from '@/components/NMList.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';
import NMMusicHomeCard from '@/components/NMMusicHomeCard.vue';
import NMServerComponent from '@/components/NMServerComponent.vue';
import NMTopResultCard from '@/components/NMTopResultCard.vue';
import NMTrackRow from '@/components/NMTrackRow.vue';
import {Swiper, SwiperSlide} from 'swiper/vue';
import {
	Card,
	Checkbox,
	ConfirmationService,
	ContextMenu,
	Dialog,
	FloatLabel,
	IftaLabel,
	InputNumber,
	InputText,
	MultiSelect,
	Ripple,
	ScrollPanel,
	Select,
	Toast,
	ToastService,
	Tooltip,
} from 'primevue';
import {SafeArea} from "capacitor-plugin-safe-area";

window.setColorScheme = setColorScheme;

declare global {
	interface Console {
		raw: (...arg: any) => void;
	}
}

console.raw = (...arg: any[]) => {
	console.log(...arg.map(a => toRaw(a)));
};

const app = createApp(AppComponent);

app.use(IonicVue);

app.use(I18NextVue, {
	i18next: i18next,
	rerenderOn: ['languageChanged', 'loaded'],
});

if (isPlatform('capacitor') && !isTv.value && !localStorage.getItem('access_token')) {
	lockPortrait().then();
	// @ts-ignore
	app.use(MobileKeycloak, {
		init: {
			refreshToken: localStorage.getItem('refresh_token') as string,
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
			app.use(router);
		}
	});
} else if (!isPlatform('capacitor')) {
	app.use(WebKeycloak, {
		init: {
			refreshToken: localStorage.getItem('refresh_token') as string,
			onLoad: 'login-required',
			checkLoginIframe: false,
			enableLogging: true,
			responseMode: 'query',
			redirectUri: `${window.location.href || '#/'}${window.location.hash.includes('?') ? '' : '?'}`,
		},
		config: keycloakConfig,
		onReady: (data) => {
			setUserFromKeycloak(data as any);
			app.use(router);
		}
	});
} else {
	let redirectUri = `nomercy://home`;
	if (location.href.includes('logout')) {
		redirectUri = `nomercy://logout`;
	}

	app.use(TvKeycloak, {
		initOptions: {
			refreshToken: localStorage.getItem('refresh_token') as string,
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
	app.use(router);
}

app.use(VueQueryPlugin, {
	enableDevtoolsV6Plugin: true,
	queryClient: queryClient,
});

app.use(PrimeVue, {
	theme: {
		preset: Aura,
	},
	ripple: true,
	inputVariant: 'outlined',
	inputStyle: 'outlined',
	options: {
		prefix: 'p',
		darkModeSelector: '.scheme-dark',
		cssLayer: {
			name: 'primevue',
			order: 'tailwind-base, primevue, tailwind-utilities'
		}
	},
});

app.use(KonamiCode, {
	onKonamiCodeEntered: () => {
		konamiEnabled.value = !konamiEnabled.value;
	},
});

app.component('NMCard', NMCard);
app.component('NMCarousel', NMCarousel);
app.component('NMContainer', NMContainer);
app.component('NMHomeCard', HomeCard);
app.component('NMList', NMList);
app.component('NMMusicCard', NMMusicCard);
app.component('NMMusicHomeCard', NMMusicHomeCard);
app.component('NMServerComponent', NMServerComponent);
app.component('NMTopResultCard', NMTopResultCard);
app.component('NMTrackRow', NMTrackRow);
app.component('Button', Button);
app.component('Modal', Modal);

app.component('SwiperContainer', Swiper);
app.component('SwiperSlide', SwiperSlide);

app.use(ConfirmationService);
app.use(ToastService);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('ContextMenu', ContextMenu);
app.component('Dialog', Dialog);
app.component('FloatLabel', FloatLabel);
app.component('IftaLabel', IftaLabel);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('MultiSelect', MultiSelect);
app.component('ScrollPanel', ScrollPanel);
app.component('Select', Select);
app.component('Toast', Toast);

router.isReady()
	.then(() => {
		app.mount('#app');
	});

useBackButton(9999, () => {
	document.dispatchEvent(new Event('backbutton'));
});

(async () => {
	await App.addListener('appUrlOpen', async (data) => {
		await router.replace(data.url.replace('nomercy://', ''));
	});

	await App.addListener('backButton', async (e) => {
		if (document.querySelector('video')) return;
		console.log('Back button pressed', e);

		if (!e.canGoBack) {
			await App.exitApp();
		} else {
			await router.back();
		}
	});
})();

