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

const SPACE_BETWEEN = 8;
// 36px target produces native-equivalent fractions on mobile:
// 2 cards → ~0.25 peek fraction, 3 cards → ~0.40 peek fraction, both ≈ 36px peek
const TARGET_PEEK_PX = 40;

// Static fractions for backdrop carousels — original tuned values kept as-is.
const STATIC_PREVIEW_BACKDROP: Record<number, number> = {
	0: 0.26,
	768: 0.21,
	1194: 0.21,
	1280: 0.23,
	1536: 0.19,
	1740: 0.21,
	2500: 0.17,
};

/**
 * Compute the fractional slidesPerView to show a target number of pixels of
 * the next card. Backdrop uses static tuned values. Poster uses pixel-based
 * calculation: TARGET_PEEK_PX=36 naturally produces ~0.25 for 2 cards and
 * ~0.40 for 3 cards, giving equal pixel peek (~36px) on both — matching native.
 */
function computePreview(limited: number, bp: number, isBackdrop: boolean): number {
	if (isBackdrop) {
		return STATIC_PREVIEW_BACKDROP[bp] ?? 0.26;
	}
	const bpWidth = bp === 0 ? window.innerWidth : bp;
	const offsetBefore = bpWidth < 800 ? 24 : 20;
	const offsetAfter = 44;
	const availableForCards = bpWidth - offsetBefore - offsetAfter - (limited - 1) * SPACE_BETWEEN;
	const target = TARGET_PEEK_PX;
	const preview = (target * limited) / Math.max(1, availableForCards - target);
	return Math.min(0.7, Math.max(0.05, preview));
}

export function breakpoints(isBackdrop: boolean, limitCardCountBy = 0) {
	const FULL = isBackdrop ? BACKDROP_FULL : POSTER_FULL;

	return Object.fromEntries(
		Object.entries(FULL).map(([bp, full]) => {
			const limited = Math.max(1, full - limitCardCountBy);
			const preview = computePreview(limited, Number(bp), isBackdrop);

			return [
				bp,
				{
					slidesPerView: limited + preview,
					slidesPerGroup: limited,
				},
			];
		}),
	);
}

export type Breakpoints = ReturnType<typeof breakpoints>;

export function swiperConfig(isBackdrop: boolean) {
	const offsetBefore = window.innerWidth < 800 ? 16 : 20;

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
		spaceBetween: SPACE_BETWEEN,

		slidesOffsetBefore: offsetBefore,
		slidesOffsetAfter: 44,
		centeredSlidesBounds: true,

		keyboard: false,
		preventInteractionOnTransition: true,
	} as SwiperOptions;
}
