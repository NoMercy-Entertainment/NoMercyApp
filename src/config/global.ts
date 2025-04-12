import { computed, ref, toRaw } from 'vue';
import { isPlatform } from '@ionic/vue';
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { MoooomIcons } from '@Icons/icons';
import { NameVal } from '@/types/api/dashboard/server';

export const isTv = useMediaQuery('(width: 960px) and (height: 540px)');
// export const isMobile = useMediaQuery('(max-width: 800px) and (orientation: portrait), (max-height: 800px) and (orientation: landscape)');
export const isMobile = ref((isPlatform('mobile') || isPlatform('mobileweb')) && !isPlatform('ipad'));

const nativeOverride = useLocalStorage('nativeOverride', false);

export const isNative = computed(() => isPlatform('cordova') || isPlatform('pwa') || nativeOverride.value);

export const dashboardCardGrid = ref('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 5xl:grid-cols-10');
export const dashboardBigCardGrid = ref('grid grid-cols-1 xl:grid-cols-3');
export const dashboardColumnGrid = ref('grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 5xl:grid-cols-10');

export const purple = "#94f"
export const blue = "#39f"
export const green = "#4b4"
export const orange = "#f90"
export const red = "#f44"
export const brown = "#963"
export const gray = "#999"

export const isDarkMode = ref((document.body.parentElement as HTMLElement).classList.contains('scheme-dark'));

export const genreColors = (title: string) => {
	let bg;
	let iconBg;
	let icon: keyof typeof MoooomIcons;
	switch (title) {
		case 'Action & Adventure':
			bg = 'text-auto-1 dark:text-grass-dark-12/12 bg-grass-light-11/10 dark:bg-grass-dark-5 border-grass-light-8 dark:border-grass-dark-8 text-grass-light-12 hover:bg-grass-light-9/10 hover:dark:bg-grass-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-grass-6))]';
			icon = 'lightning';
			iconBg = '!bg-grass-light-6 dark:!bg-grass-dark-4 group-hover/card:!bg-grass-light-7 dark:group-hover/card:!bg-grass-dark-5';
			break;
		case 'Action':
			bg = 'text-auto-1 dark:text-orange-dark-12/12 bg-orange-light-11/10 dark:bg-orange-dark-5 border-orange-light-8 dark:border-orange-dark-8 text-orange-light-12 hover:bg-orange-light-9/10 hover:dark:bg-orange-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-orange-6))]';
			icon = 'muscle';
			iconBg = '!bg-orange-light-6 dark:!bg-orange-dark-4 group-hover/card:!bg-orange-light-7 dark:group-hover/card:!bg-orange-dark-5';
			break;
		case 'Adventure':
			bg = 'text-auto-1 dark:text-gold-dark-12/12 bg-gold-light-11/10 dark:bg-gold-dark-5 border-gold-light-8 dark:border-gold-dark-8 text-gold-light-12 hover:bg-gold-light-9/10 hover:dark:bg-gold-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-gold-6))]';
			icon = 'mapClue';
			iconBg = '!bg-gold-light-6 dark:!bg-gold-dark-4 group-hover/card:!bg-gold-light-7 dark:group-hover/card:!bg-gold-dark-5';
			break;
		case 'Animation':
			bg = 'text-auto-1 dark:text-cyan-dark-12/12 bg-cyan-light-11/10 dark:bg-cyan-dark-5 border-cyan-light-8 dark:border-cyan-dark-8 text-cyan-light-12 hover:bg-cyan-light-9/10 hover:dark:bg-cyan-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-cyan-6))]';
			icon = 'designerTools';
			iconBg = '!bg-cyan-light-6 dark:!bg-cyan-dark-4 group-hover/card:!bg-cyan-light-7 dark:group-hover/card:!bg-cyan-dark-5';
			break;
		case 'Comedy':
			bg = 'text-auto-1 dark:text-purple-dark-12/12 bg-purple-light-11/10 dark:bg-purple-dark-5 border-purple-light-8 dark:border-purple-dark-8 text-purple-light-12 hover:bg-purple-light-9/10 hover:dark:bg-purple-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-purple-6))]';
			icon = 'openSmile';
			iconBg = '!bg-purple-light-6 dark:!bg-purple-dark-4 group-hover/card:!bg-purple-light-7 dark:group-hover/card:!bg-purple-dark-5';
			break;
		case 'Crime':
			bg = 'text-auto-1 dark:text-tomato-dark-12/12 bg-tomato-light-11/10 dark:bg-tomato-dark-5 border-tomato-light-8 dark:border-tomato-dark-8 text-tomato-light-12 hover:bg-tomato-light-9/10 hover:dark:bg-tomato-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-tomato-6))]';
			icon = 'chefKnife';
			iconBg = '!bg-tomato-light-6 dark:!bg-tomato-dark-4 group-hover/card:!bg-tomato-light-7 dark:group-hover/card:!bg-tomato-dark-5';
			break;
		case 'Documentary':
			bg = 'text-auto-1 dark:text-gray-dark-12/12 bg-gray-light-11/10 dark:bg-gray-dark-5 border-gray-light-8 dark:border-gray-dark-8 text-gray-light-12 hover:bg-gray-light-9/10 hover:dark:bg-gray-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-gray-6))]';
			icon = 'folderOpen';
			iconBg = '!bg-gray-light-6 dark:!bg-gray-dark-4 group-hover/card:!bg-gray-light-7 dark:group-hover/card:!bg-gray-dark-5';
			break;
		case 'Drama':
			bg = 'text-auto-1 dark:text-pink-dark-12/12 bg-pink-light-11/10 dark:bg-pink-dark-5 border-pink-light-8 dark:border-pink-dark-8 text-pink-light-12 hover:bg-pink-light-9/10 hover:dark:bg-pink-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-pink-6))]';
			icon = 'sweatSmile';
			iconBg = '!bg-pink-light-6 dark:!bg-pink-dark-4 group-hover/card:!bg-pink-light-7 dark:group-hover/card:!bg-pink-dark-5';
			break;
		case 'Family':
			bg = 'text-auto-1 dark:text-indigo-dark-12/12 bg-indigo-light-11/10 dark:bg-indigo-dark-5 border-indigo-light-8 dark:border-indigo-dark-8 text-indigo-light-12 hover:bg-indigo-light-9/10 hover:dark:bg-indigo-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-indigo-6))]';
			icon = 'multiUsers';
			iconBg = '!bg-indigo-light-6 dark:!bg-indigo-dark-4 group-hover/card:!bg-indigo-light-7 dark:group-hover/card:!bg-indigo-dark-5';
			break;
		case 'Fantasy':
			bg = 'text-auto-1 dark:text-green-dark-12/12 bg-green-light-11/10 dark:bg-green-dark-5 border-green-light-8 dark:border-green-dark-8 text-green-light-12 hover:bg-green-light-9/10 hover:dark:bg-green-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-green-6))]';
			icon = 'witchHat';
			iconBg = '!bg-green-light-6 dark:!bg-green-dark-4 group-hover/card:!bg-green-light-7 dark:group-hover/card:!bg-green-dark-5';
			break;
		case 'History':
			bg = 'text-auto-1 dark:text-brown-dark-12/12 bg-brown-light-11/10 dark:bg-brown-dark-5 border-brown-light-8 dark:border-brown-dark-8 text-brown-light-12 hover:bg-brown-light-9/10 hover:dark:bg-brown-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-brown-6))]';
			icon = 'paperScroll';
			iconBg = '!bg-brown-light-6 dark:!bg-brown-dark-4 group-hover/card:!bg-brown-light-7 dark:group-hover/card:!bg-brown-dark-5';
			break;
		case 'Horror':
			bg = 'text-auto-1 dark:text-red-dark-12/12 bg-red-light-11/10 dark:bg-red-dark-5 border-red-light-8 dark:border-red-dark-8 text-red-light-12 hover:bg-red-light-9/10 hover:dark:bg-red-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-red-6))]';
			icon = 'ghost';
			iconBg = '!bg-red-light-6 dark:!bg-red-dark-4 group-hover/card:!bg-red-light-7 dark:group-hover/card:!bg-red-dark-5';
			break;
		case 'Kids':
			bg = 'text-auto-1 dark:text-blue-dark-12/12 bg-blue-light-11/10 dark:bg-blue-dark-5 border-blue-light-8 dark:border-blue-dark-8 text-blue-light-12 hover:bg-blue-light-9/10 hover:dark:bg-blue-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-blue-6))]';
			icon = 'mouse';
			iconBg = '!bg-blue-light-6 dark:!bg-blue-dark-4 group-hover/card:!bg-blue-light-7 dark:group-hover/card:!bg-blue-dark-5';
			break;
		case 'Music':
			bg = 'text-auto-1 dark:text-amber-dark-12/12 bg-amber-light-11/10 dark:bg-amber-dark-5 border-amber-light-8 dark:border-amber-dark-8 text-amber-light-12 hover:bg-amber-light-9/10 hover:dark:bg-amber-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-amber-6))]';
			icon = 'noteSixteenthPair';
			iconBg = '!bg-amber-light-6 dark:!bg-amber-dark-4 group-hover/card:!bg-amber-light-7 dark:group-hover/card:!bg-amber-dark-5';
			break;
		case 'Mystery':
			bg = 'text-auto-1 dark:text-teal-dark-12/12 bg-teal-light-11/10 dark:bg-teal-dark-5 border-teal-light-8 dark:border-teal-dark-8 text-teal-light-12 hover:bg-teal-light-9/10 hover:dark:bg-teal-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-teal-6))]';
			icon = 'footPrint';
			iconBg = '!bg-teal-light-6 dark:!bg-teal-dark-4 group-hover/card:!bg-teal-light-7 dark:group-hover/card:!bg-teal-dark-5';
			break;
		case 'News':
			bg = 'text-auto-1 dark:text-red-dark-12/12 bg-red-light-11/10 dark:bg-red-dark-5 border-red-light-8 dark:border-red-dark-8 text-red-light-12 hover:bg-red-light-9/10 hover:dark:bg-red-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-red-6))]';
			icon = 'globe';
			iconBg = '!bg-red-light-6 dark:!bg-red-dark-4 group-hover/card:!bg-red-light-7 dark:group-hover/card:!bg-red-dark-5';
			break;
		case 'Reality':
			bg = 'text-auto-1 dark:text-sky-dark-12/12 bg-sky-light-11/10 dark:bg-sky-dark-5 border-sky-light-8 dark:border-sky-dark-8 text-sky-light-12 hover:bg-sky-light-9/10 hover:dark:bg-sky-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-sky-6))]';
			icon = 'eye';
			iconBg = '!bg-sky-light-6 dark:!bg-sky-dark-4 group-hover/card:!bg-sky-light-7 dark:group-hover/card:!bg-sky-dark-5';
			break;
		case 'Romance':
			bg = 'text-auto-1 dark:text-crimson-dark-12/12 bg-crimson-light-11/10 dark:bg-crimson-dark-5 border-crimson-light-8 dark:border-crimson-dark-8 text-crimson-light-12 hover:bg-crimson-light-9/10 hover:dark:bg-crimson-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-crimson-6))]';
			icon = 'bubbles';
			iconBg = '!bg-crimson-light-6 dark:!bg-crimson-dark-4 group-hover/card:!bg-crimson-light-7 dark:group-hover/card:!bg-crimson-dark-5';
			break;
		case 'Sci-Fi & Fantasy':
			bg = 'text-auto-1 dark:text-blue-dark-12/12 bg-blue-light-11/10 dark:bg-blue-dark-5 border-blue-light-8 dark:border-blue-dark-8 text-blue-light-12 hover:bg-blue-light-9/10 hover:dark:bg-blue-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-blue-6))]';
			icon = 'ussEnterprise';
			iconBg = '!bg-blue-light-6 dark:!bg-blue-dark-4 group-hover/card:!bg-blue-light-7 dark:group-hover/card:!bg-blue-dark-5';
			break;
		case 'Science Fiction':
			bg = 'text-auto-1 dark:text-sky-dark-12/12 bg-sky-light-11/10 dark:bg-sky-dark-5 border-sky-light-8 dark:border-sky-dark-8 text-sky-light-12 hover:bg-sky-light-9/10 hover:dark:bg-sky-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-sky-6))]';
			icon = 'rocket';
			iconBg = '!bg-sky-light-6 dark:!bg-sky-dark-4 group-hover/card:!bg-sky-light-7 dark:group-hover/card:!bg-sky-dark-5';
			break;
		case 'Soap':
			bg = 'text-auto-1 dark:text-violet-dark-12/12 bg-violet-light-11/10 dark:bg-violet-dark-5 border-violet-light-8 dark:border-violet-dark-8 text-violet-light-12 hover:bg-violet-light-9/10 hover:dark:bg-violet-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-violet-6))]';
			icon = 'bubbles';
			iconBg = '!bg-violet-light-6 dark:!bg-violet-dark-4 group-hover/card:!bg-violet-light-7 dark:group-hover/card:!bg-violet-dark-5';
			break;
		case 'Talk':
			bg = 'text-auto-1 dark:text-slate-dark-12/12 bg-slate-light-11/10 dark:bg-slate-dark-5 border-slate-light-8 dark:border-slate-dark-8 text-slate-light-12 hover:bg-slate-light-9/10 hover:dark:bg-slate-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-slate-6))]';
			icon = 'megaphone';
			iconBg = '!bg-slate-light-6 dark:!bg-slate-dark-4 group-hover/card:!bg-slate-light-7 dark:group-hover/card:!bg-slate-dark-5';
			break;
		case 'Thriller':
			bg = 'text-auto-1 dark:text-mauve-dark-12/12 bg-mauve-light-11/10 dark:bg-mauve-dark-5 border-mauve-light-8 dark:border-mauve-dark-8 text-mauve-light-12 hover:bg-mauve-light-9/10 hover:dark:bg-mauve-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-mauve-6))]';
			icon = 'searchMagnifyingGlass';
			iconBg = '!bg-mauve-light-6 dark:!bg-mauve-dark-4 group-hover/card:!bg-mauve-light-7 dark:group-hover/card:!bg-mauve-dark-5';
			break;
		case 'TV Movie':
			bg = 'text-auto-1 dark:text-yellow-dark-12/12 bg-yellow-light-11/10 dark:bg-yellow-dark-5 border-yellow-light-8 dark:border-yellow-dark-8 text-yellow-light-12 hover:bg-yellow-light-9/10 hover:dark:bg-yellow-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-yellow-6))]';
			icon = 'tv';
			iconBg = '!bg-yellow-light-6 dark:!bg-yellow-dark-4 group-hover/card:!bg-yellow-light-7 dark:group-hover/card:!bg-yellow-dark-5';
			break;
		case 'War & Politics':
			bg = 'text-auto-1 dark:text-sand-dark-12/12 bg-sand-light-11/10 dark:bg-sand-dark-5 border-sand-light-8 dark:border-sand-dark-8 text-sand-light-12 hover:bg-sand-light-9/10 hover:dark:bg-sand-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-sand-6))]';
			icon = 'medal';
			iconBg = '!bg-sand-light-6 dark:!bg-sand-dark-4 group-hover/card:!bg-sand-light-7 dark:group-hover/card:!bg-sand-dark-5';
			break;
		case 'War':
			bg = 'text-auto-1 dark:text-green-dark-12/12 bg-green-light-11/10 dark:bg-green-dark-5 border-green-light-8 dark:border-green-dark-8 text-green-light-12 hover:bg-green-light-9/10 hover:dark:bg-green-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-green-6))]';
			icon = 'gun';
			iconBg = '!bg-green-light-6 dark:!bg-green-dark-4 group-hover/card:!bg-green-light-7 dark:group-hover/card:!bg-green-dark-5';
			break;
		case 'Western':
			bg = 'text-auto-1 dark:text-yellow-dark-12/12 bg-yellow-light-11/10 dark:bg-yellow-dark-5 border-yellow-light-8 dark:border-yellow-dark-8 text-yellow-light-12 hover:bg-yellow-light-9/10 hover:dark:bg-yellow-dark-6 hover:shadow-[0px_0px_0_3px_rgb(var(--color-yellow-6))]';
			icon = 'cowboyHat';
			iconBg = '!bg-yellow-light-6 dark:!bg-yellow-dark-4 group-hover/card:!bg-yellow-light-7 dark:group-hover/card:!bg-yellow-dark-5';
			break;
		default:
			bg = ' default-background';
			icon = 'bat';
			iconBg = '';
	}
	return { bg, iconBg, icon };
};

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
		case (now >= 6 && now < 12):
			return 'Morning';
		case (now >= 12 && now < 16):
			return 'Afternoon';
		case (now >= 16 && now < 20):
			return 'Evening';
		case (now >= 20 || now < 6):
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

console.raw({
	isTv: isTv.value,
	isMobile: isMobile.value,
	isNativeMobile: isPlatform('mobile'),
	isWebMobile: isPlatform('mobileweb'),
	isNative: isNative.value,
	nativeOverride: nativeOverride.value,
	isDarkMode: isDarkMode.value,
	greetingValue: greetingValue.value,
})
