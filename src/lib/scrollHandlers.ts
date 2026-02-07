import type PlayerCore from '@nomercy-entertainment/nomercy-music-player';
import type { PlaylistItem } from '@/types/musicPlayer';
import { SliderBar } from '@/lib/sliderBar';
import { alphaNumericRange } from '@/lib/utils/string';

HTMLElement.prototype.sliderBar = function (
	player: PlayerCore<PlaylistItem>,
	callbackFn: string,
	getSizeFn?: string,
) {
	if (!(this instanceof HTMLElement) || this.dataset.type !== 'slider-bar')
		return null;
	return new SliderBar(this, player, callbackFn, getSizeFn);
};

HTMLElement.prototype.scrollHorizontalIntoView = function (
	parent?: HTMLElement,
): void {
	if (!(this instanceof HTMLElement))
		return;
	const rect = this.getBoundingClientRect();
	const parentElement = parent ?? this.parentElement;
	if (!parentElement)
		return;
	const elementLeft = rect.left - parentElement.getBoundingClientRect().left;
	parentElement.scrollTo({
		left: elementLeft,
		behavior: 'smooth',
	});
};
HTMLElement.prototype.scrollVerticalIntoView = function (
	parent?: HTMLElement,
): void {
	if (!(this instanceof HTMLElement))
		return;
	const rect = this.getBoundingClientRect();
	const parentElement = parent ?? this.parentElement;
	if (!parentElement)
		return;
	const elementTop = rect.top - parentElement.getBoundingClientRect().top;
	parentElement.scrollTo({
		top: elementTop,
		behavior: 'smooth',
	});
};
HTMLElement.prototype.animateVerticalIntoView = function (
	parentElement: HTMLElement | null = null,
	duration: number = 420,
) {
	if (!(this instanceof HTMLElement))
		return;
	const rect = this.getBoundingClientRect();
	if (!parentElement)
		parentElement = this.parentElement;
	if (!parentElement)
		return;
	const elementTop
		= rect.top
			- parentElement.getBoundingClientRect().top
			- parentElement.getBoundingClientRect().height / 2;
	const startTime = performance.now();
	const startY = parentElement.scrollTop;
	function scrollStep(timestamp: number) {
		if (!parentElement)
			return;

		const currentTime = timestamp - startTime;
		let progress = Math.min(currentTime / duration, 1);

		progress = easeInOutCubic(progress);

		parentElement.scrollTo(0, startY + elementTop * progress);

		if (currentTime < duration) {
			requestAnimationFrame(scrollStep);
		}
	}

	requestAnimationFrame(scrollStep);
};
HTMLElement.prototype.isVisible = function (parent?: HTMLElement): boolean {
	if (!this)
		return false;
	const rect = this.getBoundingClientRect();
	return (
		rect.top >= 0
		&& rect.left >= 0
		&& rect.bottom
		<= (parent?.offsetHeight || document.documentElement.clientHeight)
		&& rect.right <= (parent?.offsetWidth || document.documentElement.clientWidth)
	);
};

declare global {
	interface Document {
		// eslint-disable-next-line ts/method-signature-style
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
	}
	interface Element {
		// eslint-disable-next-line ts/method-signature-style
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
	}
	interface HTMLElement {
		// eslint-disable-next-line ts/method-signature-style
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
	}
}

Document.prototype.querySelectorAllArray = function <
	K extends keyof HTMLElementTagNameMap,
>(selector: K): HTMLElementTagNameMap[K][] {
	return Array.from(this.querySelectorAll<K>(selector));
};
Element.prototype.querySelectorAllArray = function <
	K extends keyof HTMLElementTagNameMap,
>(selector: K): HTMLElementTagNameMap[K][] {
	return Array.from(this.querySelectorAll<K>(selector));
};
HTMLElement.prototype.querySelectorAllArray = function <
	K extends keyof HTMLElementTagNameMap,
>(selector: K): HTMLElementTagNameMap[K][] {
	return Array.from(this.querySelectorAll<K>(selector));
};

function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

let timeout: string | number | NodeJS.Timeout | undefined;

export function scrollToDiv(i: string) {
	clearTimeout(timeout);

	let target: HTMLDivElement | null = null;
	if (i === '#') {
		target = document.querySelector<HTMLDivElement>(
			'ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll]',
		);
	}
	else {
		target = document.querySelector<HTMLDivElement>(
			`ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll='scroll_${i}']`,
		);
	}

	document.dispatchEvent(
		new CustomEvent('scrollToDiv', { detail: { top: target?.offsetTop } }),
	);

	let scrollContainer = document.querySelector<HTMLDivElement>(
		'.ion-page:not(.ion-page-hidden) main .group\\/scrollContainer',
	)!;
	if (!scrollContainer) {
		scrollContainer = document.querySelector<HTMLDivElement>(
			'.ion-page:not(.ion-page-hidden) ion-content .scroll-container',
		)!;
	}

	if (target && scrollContainer) {
		(scrollContainer as HTMLDivElement).scrollTo({
			top: target.offsetTop - 120,
			behavior: 'smooth',
		});

		timeout = setTimeout(() => {
			target?.classList.add('flashing');
			setTimeout(() => {
				target?.classList.remove('flashing');
			}, 3000);
		}, 700);
	}
}

export function keyHandler(e: KeyboardEvent) {
	if (
		e.key
		&& alphaNumericRange('#', 'Z').includes(e.key.toUpperCase())
	) {
		const letter = e.key?.toUpperCase();
		scrollToDiv(letter);
		// Also dispatch for virtual lists
		document.dispatchEvent(new CustomEvent('scrollToLetter', { detail: { letter } }));
	}
}
