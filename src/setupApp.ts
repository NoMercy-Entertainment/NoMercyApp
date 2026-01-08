import type { AppContext } from 'vue';
import { App } from '@capacitor/app';
import { IonicVue, isPlatform, useBackButton } from '@ionic/vue';
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
import { isMobile } from '@/config/global.ts';

import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import NMCard from '@/components/NMCard.vue';
import NMCarousel from '@/components/NMCarousel.vue';
import NMCarousel2 from '@/components/NMCarousel2.vue';

import NMContainer from '@/components/NMContainer.vue';
import NMGenreCard from '@/components/NMGenreCard.vue';
import NMGrid from '@/components/NMGrid.vue';
import HomeCard from '@/components/NMHomeCard.vue';
import NMList from '@/components/NMList.vue';
import NMSeasonCard from '@/components/NMSeasonCard.vue';
import NMSeasonTitle from '@/components/NMSeasonTitle.vue';

import NMMusicHomeCard from '@/components/NMMusicHomeCard.vue';
import NMServerComponent from '@/components/NMServerComponent.vue';
import NMTopResultCard from '@/components/NMTopResultCard.vue';
import NMTrackRow from '@/components/NMTrackRow.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';
import { Swiper } from 'swiper';
import { SwiperSlide } from 'swiper/vue';
import { register as registerSwiperElements } from 'swiper/element/bundle';

// Register Swiper custom elements globally (once)
registerSwiperElements();

export async function setupApp(app: AppContext['app']) {
	// Defer service worker setup - don't block app initialization
	if ('serviceWorker' in navigator && !import.meta.env.DEV && suffix !== '-dev') {
		// Non-blocking: set up SW update detection after app renders
		queueMicrotask(async () => {
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

	const supportsCarousel = CSS.supports('scroll-marker-group', 'after') && isMobile.value && false;

	app.component('Modal', Modal);
	app.component('NMCard', NMCard);
	app.component('NMCarousel', supportsCarousel ? NMCarousel2 : NMCarousel);
	app.component('NMCarousel2', supportsCarousel ? NMCarousel2 : NMCarousel);
	app.component('NMContainer', NMContainer);
	app.component('NMGenreCard', NMGenreCard);
	app.component('NMGrid', NMGrid);
	app.component('NMHomeCard', HomeCard);
	app.component('NMList', NMList);
	app.component('NMMusicCard', NMMusicCard);
	app.component('NMMusicHomeCard', NMMusicHomeCard);
	app.component('NMServerComponent', NMServerComponent);
	app.component('NMTopResultCard', NMTopResultCard);
	app.component('NMTrackRow', NMTrackRow);
	app.component('NMSeasonCard', NMSeasonCard);
	app.component('NMSeasonTitle', NMSeasonTitle);

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
	app.component('Swiper', Swiper);
	app.component('SwiperSlide', SwiperSlide);

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
