import { computed, ref, toRaw, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import type { MoooomIcons } from '@Icons/icons';
import type { NameVal } from '@/types/api/dashboard/server';
import { Device } from '@capacitor/device';

export const isMobile = useMediaQuery(
	'(max-width: 600px) and (orientation: portrait), (max-height: 600px) and (orientation: landscape)',
);

const nativeOverride = useLocalStorage('nativeOverride', false);

export const isNative = computed(
	() => isPlatform('cordova') || isPlatform('pwa') || nativeOverride.value,
);

export const dashboardCardGrid = ref(
	'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 5xl:grid-cols-10',
);
export const dashboardBigCardGrid = ref('grid grid-cols-1 xl:grid-cols-3');
export const dashboardColumnGrid = ref(
	'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 5xl:grid-cols-10',
);

export const buttonClasses = 'grid relative place-content-center h-10 min-w-10 active:outline outline-focus focus-visible:outline z-0 justify-center disabled:opacity-50 disabled:text-surface-9 text-surface-12/12 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-surface-12/2 active:sm:bg-surface-12/4 focus-visible:sm:bg-surface-12/4 hover:sm:bg-surface-12/4';

export const purple = '#94f';
export const blue = '#39f';
export const green = '#4b4';
export const orange = '#f90';
export const red = '#f44';
export const brown = '#963';
export const gray = '#999';

export const isDarkMode = ref(
	(document.body.parentElement as HTMLElement).classList.contains('scheme-dark'),
);

export function genreColors(title: string) {
	let bg;
	let iconBg;
	let icon: keyof typeof MoooomIcons;
	switch (title) {
		case 'Action & Adventure':
			bg = 'theme-grass';
			icon = 'lightning';
			iconBg
				= '';
			break;
		case 'Action':
			bg = 'theme-orange';
			icon = 'muscle';
			iconBg
				= 'theme-orange';
			break;
		case 'Adventure':
			bg = 'theme-gold';
			icon = 'mapClue';
			iconBg
				= 'theme-gold';
			break;
		case 'Animation':
			bg = 'theme-cyan';
			icon = 'designerTools';
			iconBg
				= 'theme-cyan';
			break;
		case 'Comedy':
			bg = 'theme-purple';
			icon = 'openSmile';
			iconBg
				= 'theme-purple';
			break;
		case 'Crime':
			bg = 'theme-tomato';
			icon = 'chefKnife';
			iconBg
				= 'theme-tomato';
			break;
		case 'Documentary':
			bg = 'theme-gray';
			icon = 'folderOpen';
			iconBg
				= 'theme-gray';
			break;
		case 'Drama':
			bg = 'theme-pink';
			icon = 'sweatSmile';
			iconBg
				= 'theme-pink';
			break;
		case 'Family':
			bg = 'theme-indigo';
			icon = 'multiUsers';
			iconBg
				= 'theme-indigo';
			break;
		case 'Fantasy':
			bg = 'theme-green';
			icon = 'witchHat';
			iconBg
				= 'theme-green';
			break;
		case 'History':
			bg = 'theme-brown';
			icon = 'paperScroll';
			iconBg
				= 'theme-brown';
			break;
		case 'Horror':
			bg = 'theme-red';
			icon = 'ghost';
			iconBg
				= 'theme-red';
			break;
		case 'Kids':
			bg = 'theme-blue';
			icon = 'mouse';
			iconBg
				= 'theme-blue';
			break;
		case 'Music':
			bg = 'theme-amber';
			icon = 'noteSixteenthPair';
			iconBg
				= 'theme-amber';
			break;
		case 'Mystery':
			bg = 'theme-teal';
			icon = 'footPrint';
			iconBg
				= 'theme-teal';
			break;
		case 'News':
			bg = 'theme-red';
			icon = 'globe';
			iconBg
				= 'theme-red';
			break;
		case 'Reality':
			bg = 'theme-sky';
			icon = 'eye';
			iconBg
				= 'theme-sky';
			break;
		case 'Romance':
			bg = 'theme-crimson';
			icon = 'bubbles';
			iconBg
				= 'theme-crimson';
			break;
		case 'Sci-Fi & Fantasy':
			bg = 'theme-blue';
			icon = 'ussEnterprise';
			iconBg
				= 'theme-blue';
			break;
		case 'Science Fiction':
			bg = 'theme-sky';
			icon = 'rocket';
			iconBg
				= 'theme-sky';
			break;
		case 'Soap':
			bg = 'theme-violet';
			icon = 'bubbles';
			iconBg
				= 'theme-violet';
			break;
		case 'Talk':
			bg = 'theme-slate';
			icon = 'megaphone';
			iconBg
				= 'theme-surface';
			break;
		case 'Thriller':
			bg = 'theme-mint';
			icon = 'searchMagnifyingGlass';
			iconBg
				= 'theme-mint';
			break;
		case 'TV Movie':
			bg = 'theme-yellow';
			icon = 'tv';
			iconBg
				= 'theme-yellow';
			break;
		case 'War & Politics':
			bg = 'theme-sand';
			icon = 'medal';
			iconBg
				= 'theme-sand';
			break;
		case 'War':
			bg = 'theme-green';
			icon = 'gun';
			iconBg
				= 'theme-green';
			break;
		case 'Western':
			bg = 'theme-yellow';
			icon = 'cowboyHat';
			iconBg
				= 'theme-yellow';
			break;
		default:
			bg = ' bg-surface-6/11';
			icon = 'bat';
			iconBg = '';
	}
	return { bg, iconBg, icon };
}

export const media_types: NameVal[] = [
	{
		title: 'Anime',
		value: 'anime',
	},
	{
		title: 'Movie',
		value: 'movie',
	},
	{
		title: 'TV Show',
		value: 'tv',
	},
	{
		title: 'Music',
		value: 'music',
	},
	{
		title: 'Images',
		value: 'image',
	},
	{
		title: 'Audio Books',
		value: 'audiobook',
	},
];

export const greetingValue = computed(() => {
	const now = new Date().getHours();

	switch (true) {
		case now >= 6 && now < 12:
			return 'Morning';
		case now >= 12 && now < 18:
			return 'Afternoon';
		case now >= 18 && now < 24:
			return 'Evening';
		case now >= 24 || now < 6:
			return 'Night';
	}
	return 'Day';
});

declare global {
	interface Console {
		raw: (...arg: any) => void;
	}
}

console.raw = (...arg: any[]) => {
	console.log(...arg.map(a => toRaw(a)));
};

(async () => {
	const deviceInfo = await Device.getId().then(device => device.identifier);
	console.raw({
		isMobile: isMobile.value,
		isNativeMobile: isPlatform('mobile'),
		isWebMobile: isPlatform('mobileweb'),
		isNative: isNative.value,
		nativeOverride: nativeOverride.value,
		isDarkMode: isDarkMode.value,
		greetingValue: greetingValue.value,
		device_id: deviceInfo,
	});
})();

