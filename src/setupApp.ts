import type { AppContext } from 'vue';
import { App } from '@capacitor/app';
import { IonicVue, useBackButton } from '@ionic/vue';
import Aura from '@primevue/themes/aura';
import { VueQueryPlugin } from '@tanstack/vue-query';
import MasonryWall from '@yeger/vue-masonry-wall';
import I18NextVue from 'i18next-vue';

import '@primeuix/styled';
import '@/lib/scrollHandlers';
import '@/store/deviceInfo';
import '@/store/screensaver';

import {
	Card,
	ConfirmationService,
	Dialog,
	InputNumber,
	InputText,
	MultiSelect,
	Ripple,
	ScrollPanel,
	Select,
	Textarea,
	Toast,
	ToastService,
	Tooltip,
} from 'primevue';
import PrimeVue from 'primevue/config';
// @ts-ignore
import KonamiCode from 'vue3-konami-code';

import { suffix } from '@/config/config.ts';
import i18next from '@/config/i18next';
import { queryClient } from '@/config/tanstack-query';
import konamiEnabled from '@/store/konami';
import router from './router';

import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';

export async function setupApp(app: AppContext['app']) {
	// Defer service worker setup and version checks - don't block app initialization
	if (!import.meta.env.DEV) {
		queueMicrotask(async () => {
			// Start periodic version checks against /version.json
			try {
				const { startVersionChecks } = await import('@/lib/versionCheck');
				startVersionChecks();
			}
			catch (error) {
				console.warn('Version check setup failed:', error);
			}

			// Set up SW update detection after app renders
			if ('serviceWorker' in navigator && suffix !== '-dev') {
				try {
					await navigator.serviceWorker.ready;
					const { setupServiceWorkerUpdates } = await import(
						'@/lib/serviceWorkerUpdates',
					);
					setupServiceWorkerUpdates();
				}
				catch (error) {
					console.warn('Service worker setup failed:', error);
				}
			}
		});
	}

	app.use(router);
	app.use(IonicVue);
	app.use(I18NextVue, {
		i18next,
		rerenderOn: ['languageChanged', 'loaded'],
	});

	app.use(VueQueryPlugin, {
		enableDevtoolsV6Plugin: true,
		queryClient,
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
				order: 'tailwind-base, primevue, tailwind-utilities',
			},
		},
	});

	app.use(KonamiCode, {
		onKonamiCodeEntered: () => {
			konamiEnabled.value = !konamiEnabled.value;
		},
	});

	app.use(MasonryWall);

	app.component('Modal', Modal);
	app.component('Button', Button);
	app.component('Card', Card);
	app.component('Dialog', Dialog);
	app.component('InputNumber', InputNumber);
	app.component('InputText', InputText);
	app.component('MultiSelect', MultiSelect);
	app.component('ScrollPanel', ScrollPanel);
	app.component('Select', Select);
	app.component('Toast', Toast);
	app.component('Textarea', Textarea);
	app.directive('ripple', Ripple);
	app.directive('tooltip', Tooltip);

	app.use(ConfirmationService);
	app.use(ToastService);

	router.isReady().then(() => {
		app.mount('#app');
	});

	useBackButton(9999, () => {
		document.dispatchEvent(new Event('backbutton'));
	});

	await App.addListener('backButton', async (e) => {
		if (document.querySelector('video'))
			return;
		console.log('Back button pressed', e);

		if (!e.canGoBack) {
			await App.exitApp();
		}
		else {
			router.back();
		}
	});
}
