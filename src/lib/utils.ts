import {camelize, getCurrentInstance, ref, toHandlerKey} from 'vue';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

import type {InfoResponse} from '@/types/api/base/info';
import {isTv} from '@/config/global';
import {isPlatform} from '@ionic/vue';
import {AndroidFullScreen, AndroidSystemUiFlags} from '@awesome-cordova-plugins/android-full-screen';
import {StatusBar} from '@capacitor/status-bar';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function useEmitAsProps<Name extends string>(
	emit: (name: Name, ...args: any[]) => void
) {
	const vm = getCurrentInstance();

	const events = vm?.type.emits as Name[];
	const result: Record<string, any> = {};
	if (!events?.length) {
		console.warn(
			`No emitted event found. Please check component: ${vm?.type.__name}`
		);
	}

	events?.forEach((ev) => {
		result[toHandlerKey(camelize(ev))] = (...arg: any) => emit(ev, ...arg);
	});
	return result;
}

export const episodeCounter = (data: InfoResponse) => {

	let number_of_items = 0;
	let have_items = 0;

	if (data && data?.number_of_items) {
		number_of_items = data.number_of_items ?? 0;
		have_items = data.have_items ?? 0;

		have_items = have_items >= 0
			? have_items
			: 0;
	}

	return {
		number_of_items,
		have_items,
	};
};

export const scrollIntoView = (parent?: HTMLElement) => {
	const scrollDuration = 300;
	const parentElement = parent ?? document.activeElement!.parentElement!;
	const elementTop = document.activeElement!.getBoundingClientRect().top + (document.activeElement!.getBoundingClientRect().height / 2) - (parentElement.offsetHeight / 3);
	const startingY = parentElement.scrollTop;
	const startTime = performance.now();

	function scrollStep(timestamp: number) {
		const currentTime = timestamp - startTime;
		const progress = Math.min(currentTime / scrollDuration, 1);

		parentElement.scrollTo(startingY + elementTop * progress, 0);

		if (currentTime < scrollDuration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
};

export const scrollCenter = (el: HTMLElement, container: HTMLElement, options?: {
	duration?: number;
	margin?: number;
}
) => {
	if (!el) return;
	console.log('scroll Center', el, container);

	const scrollDuration = options?.duration || 60;
	const margin = options?.margin || 1.5;

	const elementTop = (el.getBoundingClientRect().top) + (el!.getBoundingClientRect().height / 2) - (container.getBoundingClientRect().height / margin);

	// console.log('elementTop', [el.getBoundingClientRect().top, container.scrollTop]);
	const startingY = container.scrollTop;
	const startTime = performance.now();

	function scrollStep(timestamp: number) {
		const currentTime = timestamp - startTime;
		const progress = Math.min(currentTime / scrollDuration, 1);

		container.scrollTo(0, Math.floor(startingY + (elementTop * progress)));

		if (currentTime < scrollDuration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
};

export const scrollTo = (el: HTMLElement, options?: { duration?: number; margin?: number; }) => {

	const scrollDuration = options?.duration || 60;
	const margin = options?.margin || 1.5;

	const startingY = el.scrollTop;
	const startTime = performance.now();

	function scrollStep(timestamp: number) {
		const currentTime = timestamp - startTime;
		const progress = Math.min(currentTime / scrollDuration, 1);

		el.scrollTo(0, Math.floor(startingY + margin * progress));

		if (currentTime < scrollDuration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
};


// let timeout: NodeJS.Timeout = <NodeJS.Timeout>{};
export const scrollIntoBox = () => {

	// clearTimeout(timeout!);

	// timeout = setTimeout(() => {

	const scrollDuration = 100;
	const boundingRect = document.activeElement!.getBoundingClientRect();
	const parentElement = document.activeElement!.parentElement!;
	const elementLeft = boundingRect.left - (boundingRect.width / 1.8);

	const startingX = (document.activeElement as HTMLDivElement)!.dataset?.x
		? parseInt((document.activeElement! as HTMLDivElement)!.dataset!.x as string, 10) * ((boundingRect.width / 1.8) * 4)
		: parentElement.scrollLeft;

	const startTime = performance.now();

	function scrollStep(timestamp: number) {
		const currentTime = timestamp - startTime;
		const progress = Math.min(currentTime / scrollDuration, 1);

		parentElement!.scrollTo(startingX + elementLeft * progress, 300);

		if (currentTime < scrollDuration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
	// }, 0);
};

/**
 * Determines whether the given element should have a marquee effect.
 *
 * Sets the `aniate-marquee` class on the child with `data-marquee='scroller'`.
 * @param {HTMLElement} el - The element to check.
 */
export const shouldMarquee = (el: HTMLElement) => {
	const scroller = el.querySelector<HTMLElement>('[data-marquee="scroller"]')!;
	scroller.style.removeProperty('--marquee-width');
	scroller.classList.remove('animate-marquee');

	const containerWidth = el.getBoundingClientRect()?.width ?? 0;
	const scrollerWidth = scroller.getBoundingClientRect()?.width ?? 0;

	if (containerWidth < scrollerWidth) {
		scroller.style.setProperty('--marquee-width', `${containerWidth}px`);
		scroller.classList.add('animate-marquee');
	} else {
		scroller.style.removeProperty('--marquee-width');
		scroller.classList.remove('animate-marquee');
	}
};

export const stopPropagation = (e: Event) => e.stopPropagation();
export const preventDefault = (e: Event) => e.preventDefault();
export const stopAndPrevent = (e: Event) => {
	e.stopPropagation();
	e.preventDefault();
};

export const lockPortrait = async () => {
	if (isPlatform('capacitor') && !isTv.value) {
		const {ScreenOrientation} = (await import('@capacitor/screen-orientation'));
		try {
			ScreenOrientation.lock({
				orientation: 'portrait',
			}).then();
		} catch (e) {
			//
		}
	}
}

export const lockLandscape = async () => {
	if (isPlatform('capacitor') && !isTv.value) {
		const {ScreenOrientation} = (await import('@capacitor/screen-orientation'));
		try {
			ScreenOrientation.lock({
				orientation: 'landscape',
			}).then();
		} catch (e) {
			//
		}
	}
}

export const unlockOrientation = async () => {
	if (isPlatform('capacitor')) {
		const {ScreenOrientation} = (await import('@capacitor/screen-orientation'));
		try {
			ScreenOrientation.unlock().then();
		} catch (e) {
			//
		}
	}
}

export const isPortrait = () => {
	return window.innerHeight > window.innerWidth;
}

export const isLandscape = () => {
	return window.innerHeight < window.innerWidth;
}

const timeout = ref<NodeJS.Timeout>();
const isLeanModeEnabled = ref(false);

export const enableImmersiveMode = async () => {
	if (isPlatform('capacitor') && !isTv.value && !isLeanModeEnabled.value) {
		isLeanModeEnabled.value = true;
		window.addEventListener('touchstart', listener);
		listener();

		await AndroidFullScreen.setSystemUiVisibility(
			AndroidSystemUiFlags.LayoutHideNavigation
			| AndroidSystemUiFlags.HideNavigation
			| AndroidSystemUiFlags.LayoutFullscreen
			| AndroidSystemUiFlags.LayoutStable
			| AndroidSystemUiFlags.Fullscreen);
		await StatusBar.setOverlaysWebView({overlay: true});
	}
};

export const disableImmersiveMode = () => {
	if (isPlatform('capacitor') && !isTv.value && isLeanModeEnabled.value) {
		isLeanModeEnabled.value = false;

		window.removeEventListener('touchstart', listener);
		clearInterval(timeout.value);

		StatusBar.show().then();
		AndroidFullScreen.showSystemUI().then();
		StatusBar.setOverlaysWebView({overlay: true}).then();
	}
};

const listener = () => {
	clearInterval(timeout.value);

	timeout.value = setInterval(async () => {
		await AndroidFullScreen.setSystemUiVisibility(
			AndroidSystemUiFlags.LayoutHideNavigation
			| AndroidSystemUiFlags.HideNavigation
			| AndroidSystemUiFlags.LayoutFullscreen
			| AndroidSystemUiFlags.LayoutStable
			| AndroidSystemUiFlags.Fullscreen);
	}, 3000);
};

const clicks = ref(0);
const timer = ref<NodeJS.Timeout>();
const delay = 300;

export const onDoubleClick = (event: MouseEvent, click: (event: MouseEvent) => void, double: (event: MouseEvent) => void) => {
	clicks.value++;
	if (clicks.value === 1) {
		timer.value = setTimeout( () => {
			clicks.value = 0
			click(event);
		}, delay);
	} else {
		clearTimeout(timer.value);

		double?.(event);
		clicks.value = 0;
	}
}

export class ClickEventHandler {
	private clicked = 0;
	private doubleClickLength = 350;
	private pendingClick: NodeJS.Timeout = <NodeJS.Timeout>{};
	private readonly singleClickEvtCallback;
	private readonly doubleClickEvtCallback;

	constructor(
		el: HTMLElement,
		singleClickEvtCallback: (event: MouseEvent) => void,
		doubleClickEvtCallback: (event: MouseEvent) => void,
		doubleClickLength: number = 350
	) {
		this.singleClickEvtCallback = singleClickEvtCallback;
		this.doubleClickEvtCallback = doubleClickEvtCallback;
		this.doubleClickLength = doubleClickLength;
		el.removeEventListener("click", this.leftClickHandler);
		el.addEventListener("click", this.leftClickHandler);
	}
	leftClickHandler(e: MouseEvent) {
		console.log('leftClickHandler', e);
		if (e.button != 0) return; // only left clicks shall be handled;
		this.clicked++;
		if (this.clicked >= 2) {
			this.doubleClickEvtCallback(e);
			clearTimeout(this.pendingClick);
			this.clicked = 0;
			return;
		}
		clearTimeout(this.pendingClick);
		this.pendingClick = setTimeout(() => {
			this.singleClickEvtCallback(e);
			this.clicked = 0;
		}, this.doubleClickLength);
	}
}

