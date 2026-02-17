// @ts-ignore
import type { SwiperOptions } from 'swiper/types/swiper-options.d';

const POSTER_FULL: Record<number, number> = {
	0: 3,
	768: 4,
	1194: 6,
	1280: 7,
	1536: 7,
	1740: 9,
	2500: location.hash.replace('#', '').startsWith('/person') ? 10 : 16,
};

const BACKDROP_FULL: Record<number, number> = {
	0: 2,
	768: 2,
	1194: 3,
	1280: 4,
	1536: 4,
	1740: 5,
	2500: 8,
};

const POSTER_PREVIEW: Record<number, number> = {
	0: 0.41,
	768: 0.41,
	1194: 0.41,
	1280: 0.40,
	1536: 0.32,
	1740: 0.37,
	2500: 0.34,
};

const BACKDROP_PREVIEW: Record<number, number> = {
	0: 0.26,
	768: 0.21,
	1194: 0.21,
	1280: 0.23,
	1536: 0.19,
	1740: 0.21,
	2500: 0.17,
};

export function breakpoints(isBackdrop: boolean, limitCardCountBy = 0) {
	const FULL = isBackdrop ? BACKDROP_FULL : POSTER_FULL;
	const PREVIEW = isBackdrop ? BACKDROP_PREVIEW : POSTER_PREVIEW;

	return Object.fromEntries(
		Object.entries(FULL).map(([bp, full]) => {
			const limited = Math.max(1, full - limitCardCountBy);

			return [
				bp,
				{
					slidesPerView: limited + PREVIEW[Number(bp)],
					slidesPerGroup: limited,
				},
			];
		}),
	);
}

export type Breakpoints = ReturnType<typeof breakpoints>;

export function swiperConfig(isBackdrop: boolean) {
	const offsetBefore = window.innerWidth < 800 ? 24 : 20;

	return {
		breakpoints: breakpoints(isBackdrop),
		allowTouchMove: true,
		breakpointsBase: 'window',

		virtual: {
			enabled: true,
			addSlidesAfter: 2,
			addSlidesBefore: 2,
		},

		speed: 100,
		spaceBetween: 12,

		slidesOffsetBefore: offsetBefore,
		slidesOffsetAfter: 44,
		centeredSlidesBounds: true,

		keyboard: false,
		preventInteractionOnTransition: true,
	} as SwiperOptions;
}
