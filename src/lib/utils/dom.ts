import { ref } from 'vue';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { InfoResponse } from '@/types/api/base/info';

import { isPlatform } from '@ionic/vue';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function episodeCounter(data: InfoResponse) {
	let number_of_items = 0;
	let have_items = 0;

	if (data && data?.number_of_items) {
		number_of_items = data.number_of_items ?? 0;
		have_items = data.have_items ?? 0;

		have_items = have_items >= 0 ? have_items : 0;
	}

	return {
		number_of_items,
		have_items,
	};
}

export function scrollIntoView(parent?: HTMLElement) {
	const scrollDuration = 300;
	const parentElement = parent ?? document.activeElement!.parentElement!;
	if (!parentElement)
		return;

	const elementTop
		= document.activeElement!.getBoundingClientRect().top
			+ document.activeElement!.getBoundingClientRect().height / 2
			- parentElement.offsetHeight / 3;
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
}

export function scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
	duration?: number;
	margin?: number;
}) {
	if (!el || !container)
		return;

	const scrollDuration = options?.duration || 60;

	const containerRect = container.getBoundingClientRect();
	const elementRect = el.getBoundingClientRect();

	// Calculate the desired center position of the element within the container.
	const elementCenterY = elementRect.top + elementRect.height / 2;
	const containerCenterY = containerRect.top + containerRect.height / 2;

	// Calculate the scroll offset needed to center the element.
	const scrollOffset = elementCenterY - containerCenterY;

	// Calculate the target scroll position.
	const targetScrollTop = container.scrollTop + scrollOffset;

	const startingY = container.scrollTop;
	const startTime = performance.now();

	function scrollStep(timestamp: number) {
		const currentTime = timestamp - startTime;
		const progress = Math.min(currentTime / scrollDuration, 1);

		const newScrollTop = startingY + (targetScrollTop - startingY) * progress;
		container.scrollTo(0, Math.floor(newScrollTop));

		if (currentTime < scrollDuration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
}

export function scrollTo(el: HTMLElement, options?: { duration?: number; margin?: number }) {
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
}

export function scrollIntoBox() {
	const scrollDuration = 100;
	const boundingRect = document.activeElement!.getBoundingClientRect();
	const parentElement = document.activeElement!.parentElement!;
	const elementLeft = boundingRect.left - boundingRect.width / 1.8;

	const startingX = (document.activeElement as HTMLDivElement)!.dataset?.x
		? Number.parseInt(
			(document.activeElement! as HTMLDivElement)!.dataset!.x as string,
			10,
		)
		* ((boundingRect.width / 1.8) * 4)
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
}

/**
 * Determines whether the given element should have a marquee effect.
 *
 * Sets the `aniate-marquee` class on the child with `data-marquee='scroller'`.
 * @param {HTMLElement} el - The element to check.
 */
export function shouldMarquee(el: HTMLElement) {
	const scroller = el.querySelector<HTMLElement>('[data-marquee="scroller"]')!;
	scroller.style.removeProperty('--marquee-width');
	scroller.classList.remove('animate-marquee');

	const containerWidth = el.getBoundingClientRect()?.width ?? 0;
	const scrollerWidth = scroller.getBoundingClientRect()?.width ?? 0;

	if (containerWidth < scrollerWidth) {
		scroller.style.setProperty('--marquee-width', `${containerWidth}px`);
		scroller.classList.add('animate-marquee');
	}
	else {
		scroller.style.removeProperty('--marquee-width');
		scroller.classList.remove('animate-marquee');
	}
}

export const stopPropagation = (e: Event) => e.stopPropagation();
export const preventDefault = (e: Event) => e.preventDefault();

export function stopAndPrevent(e: Event) {
	e.stopPropagation();
	e.preventDefault();
}

export async function lockPortrait() {
	if (isPlatform('capacitor')) {
		const { ScreenOrientation } = await import('@capacitor/screen-orientation');
		try {
			await ScreenOrientation.lock({
				orientation: 'portrait',
			});
		}
		catch (e) {
			//
		}
	}
}

export async function lockLandscape() {
	if (isPlatform('capacitor')) {
		const { ScreenOrientation } = await import('@capacitor/screen-orientation');
		try {
			await ScreenOrientation.lock({
				orientation: 'landscape',
			});
		}
		catch {
			//
		}
	}
}

export async function unlockOrientation() {
	if (isPlatform('capacitor')) {
		const { ScreenOrientation } = await import('@capacitor/screen-orientation');
		try {
			await ScreenOrientation.unlock();
		}
		catch {
			//
		}
	}
}

export function isPortrait() {
	return window.innerHeight > window.innerWidth;
}

export function isLandscape() {
	return window.innerHeight < window.innerWidth;
}

export async function enableImmersiveMode() {
	// No-op: Cordova/Capacitor native plugins removed
}

export async function disableImmersiveMode() {
	// No-op: Cordova/Capacitor native plugins removed
}

const clicks = ref(0);
const timer = ref<NodeJS.Timeout>();
const delay = 300;

export function onDoubleClick(event: MouseEvent, click: (event: MouseEvent) => void, double: (event: MouseEvent) => void) {
	clicks.value++;
	if (clicks.value === 1) {
		timer.value = setTimeout(() => {
			clicks.value = 0;
			click(event);
		}, delay);
	}
	else {
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
		doubleClickLength: number = 350,
	) {
		this.singleClickEvtCallback = singleClickEvtCallback;
		this.doubleClickEvtCallback = doubleClickEvtCallback;
		this.doubleClickLength = doubleClickLength;
		el.removeEventListener('click', this.leftClickHandler);
		el.addEventListener('click', this.leftClickHandler);
	}

	leftClickHandler(e: MouseEvent) {
		console.log('leftClickHandler', e);
		if (e.button !== 0)
			return; // only left clicks shall be handled;
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

export function libraryIconName(type: string) {
	switch (type) {
		case 'anime':
		case 'tv':
			return 'monitor';
		case 'movie':
			return 'movieClap';
	}
}
