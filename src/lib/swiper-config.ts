// @ts-ignore
import {SwiperOptions} from 'swiper/types/swiper-options.d';

export const breakpoints = (isBackdrop: boolean) => {
	return {
		0: !isBackdrop
			? {
				slidesPerView: 3,
				slidesPerGroup: 1,
			}
			: {
				slidesPerView: 1.8,
				slidesPerGroup: 1,
			},
		768: !isBackdrop
			? {
				slidesPerView: 6.3,
				slidesPerGroup: 5,
			}
			: {
				slidesPerView: 3.2,
				slidesPerGroup: 3,
			},
		1194: !isBackdrop
			? {
				slidesPerView: 6.4,
				slidesPerGroup: 6,
			}
			: {
				slidesPerView: 6.4,
				slidesPerGroup: 6,
			},
		1280: !isBackdrop
			? {
				slidesPerView: 7.2,
				slidesPerGroup: 7,
			}
			: {
				slidesPerView: 4.12,
				slidesPerGroup: 4,
			},
		1536: !isBackdrop
			? {
				slidesPerView: 7.2,
				slidesPerGroup: 7,
			}
			: {
				slidesPerView: 4.12,
				slidesPerGroup: 4,
			},
		1740: !isBackdrop
			? {
				slidesPerView: 9.4,
				slidesPerGroup: 9,
			}
			: {
				slidesPerView: 5.2,
				slidesPerGroup: 5,
			},
		2500: !isBackdrop
			? {
				slidesPerView: location.hash.replace('#', '').startsWith('/person')
					? 10.4
					: 14.4,
				slidesPerGroup: location.hash.replace('#', '').startsWith('/person')
					? 10
					: 14,
			}
			: {
				slidesPerView: 8.12,
				slidesPerGroup: 8,
			},
	};
};

export type Breakpoints = ReturnType<typeof breakpoints>;

export const swiperConfig = (isBackdrop: boolean) => {
	return {
		breakpoints: breakpoints(isBackdrop),
		allowTouchMove: true,
		mousewheelControl: {
			enabled: true,
		},
		breakpointsBase: 'window',
		virtual: false,
		updateOnWindowResize: true,
		speed: 100,
		spaceBefore: 12,
		slidesOffsetAfter: 8,
		spaceBetween: 12,
		keyboard: true,
		// mousewheel: true,
		mouseWheelOptions: {
			enabled: true,
			forceToAxis: true,
			invert: true,
			releaseOnEdges: true,
			sensitivity: 10,
		},
		onProgress: (swiper: any) => {
			// const slides = swiper.slides;
			// const progress = swiper.progress;
			// slides.forEach((slide: any) => {
			//     const slideProgress = slide.progress;
			//     const slideOffset = slide.swiperSlideOffset;
			//     const offset = (progress - slideProgress) * slideOffset;
			//     slide.style.transform = `translateX(${offset}px)`;
			// });
		},
		onSlideChange: (swiper: any) => {
			// const slides = swiper.slides;
			// slides.forEach((slide: any) => {
			//     slide.style.transform = '';
			// });
		},
	} as SwiperOptions;
};
