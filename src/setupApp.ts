import type { AppContext } from 'vue';
import { App } from '@capacitor/app';
import { IonicVue, isPlatform, useBackButton } from '@ionic/vue';
import { Form } from '@primevue/forms';
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
	Checkbox,
	ConfirmationService,
	ContextMenu,
	Dialog,
	FloatLabel,
	IftaLabel,
	Image,
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
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
import KonamiCode from 'vue3-konami-code';

import Button from '@/components/Buttons/Button.vue';

import Modal from '@/components/Modal.vue';
import NMCard from '@/components/NMCard.vue';
import NMCarousel from '@/components/NMCarousel.vue';

import NMContainer from '@/components/NMContainer.vue';
import NMGenreCard from '@/components/NMGenreCard.vue';
import NMGrid from '@/components/NMGrid.vue';
import HomeCard from '@/components/NMHomeCard.vue';
import NMList from '@/components/NMList.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';
import NMSeasonCard from '@/components/NMSeasonCard.vue';
import NMSeasonTitle from '@/components/NMSeasonTitle.vue';

import NMMusicHomeCard from '@/components/NMMusicHomeCard.vue';
import NMServerComponent from '@/components/NMServerComponent.vue';
import NMTopResultCard from '@/components/NMTopResultCard.vue';
import NMTrackRow from '@/components/NMTrackRow.vue';
import { suffix } from '@/config/config.ts';
import i18next from '@/config/i18next';
import { queryClient } from '@/config/tanstack-query';
import konamiEnabled from '@/store/konami';
import { redirectUrl } from '@/store/routeState';
import router from './router';

export async function setupApp(app: AppContext['app']) {
	if ('serviceWorker' in navigator && !import.meta.env.DEV) {
		// Log service worker status for debugging
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			console.log('All SW registrations:', registrations);
			registrations.forEach((reg, index) => {
				console.log(`Registration ${index}:`, {
					scope: reg.scope,
					installing: reg.installing?.scriptURL,
					waiting: reg.waiting?.scriptURL,
					active: reg.active?.scriptURL,
				});
			});
		});
	}
	if ('serviceWorker' in navigator && !import.meta.env.DEV && suffix !== '-dev') {
		await navigator.serviceWorker.ready;

		// Set up service worker update detection
		const { setupServiceWorkerUpdates } = await import(
			'@/lib/serviceWorkerUpdates'
		);
		setupServiceWorkerUpdates();
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
	app.component('NMCard', NMCard);
	app.component('NMCarousel', NMCarousel);
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

	app.component('SwiperContainer', Swiper);
	app.component('SwiperSlide', SwiperSlide);

	app.directive('ripple', Ripple);
	app.directive('tooltip', Tooltip);
	app.component('Button', Button);
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
	app.component('Textarea', Textarea);
	app.component('Image', Image);
	app.component('Form', Form);

	app.use(ConfirmationService);
	app.use(ToastService);

	if (!sessionStorage.getItem('load') && isPlatform('capacitor')) {
		setTimeout(() => {
			sessionStorage.setItem('load', 'true');
			location.reload();
		}, 500);
	}

	router.isReady().then(() => {
		app.mount('#app');

		setTimeout(() => {
			if (location.search.includes('redirectUrl')) {
				redirectUrl.value = location.search
					.split('redirectUrl=')[1]
					.split('&')[0];
			}

			if (redirectUrl.value !== '/home') {
				router.push(redirectUrl.value).then();
			}
		}, 1000);
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
