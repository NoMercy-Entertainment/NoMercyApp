/// <reference types="vite/client" />

import {VueKeycloakInstance} from '@dsb-norge/vue-keycloak-js/dist/types';
import {SliderBar} from '@/lib/MusicPlayer/lib/sliderBar';
import {ScrollBaseDetail} from '@ionic/core/dist/types/components/content/content-interface';
import {SwiperRef} from 'swiper/swiper-react';

declare module '*.svg'
declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.png';
declare module '*.gif';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties  {
		$keycloak: VueKeycloakInstance;
		$t: (key?: string, args?: unknown) => string;
	}
}

declare interface VueScrollEvent {
	srcElement: HTMLElement;
	target: HTMLElement;
}

declare global {
	interface HTMLElement extends ParentNode {
		sliderBar: (player: any, callbackFn: string, getSizeFn?: string) => SliderBar | null;
		scrollHorizontalIntoView: (parentElement?: HTMLElement) => void;
		scrollVerticalIntoView: (parentElement?: HTMLElement) => void;
		animateVerticalIntoView: (parentElement?: HTMLElement | null, duration?: number) => void;
		firstChild: HTMLElement | null;
		lastChild: HTMLElement | null;
		children: HTMLCollection;
		isVisible: (parent?: HTMLElement) => boolean;
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selectors: K): Array<HTMLElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof SVGElementTagNameMap>(selectors: K): Array<SVGElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof MathMLElementTagNameMap>(selectors: K): Array<MathMLElementTagNameMap[K]>;
		querySelectorAllArray<E extends Element = Element>(selectors: string): Array<E>;
	}
	interface Element {
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selectors: K): Array<HTMLElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof SVGElementTagNameMap>(selectors: K): Array<SVGElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof MathMLElementTagNameMap>(selectors: K): Array<MathMLElementTagNameMap[K]>;
		querySelectorAllArray<E extends Element = Element>(selectors: string): Array<E>;
	}
	interface Document {
		querySelectorAllArray<K extends keyof HTMLElementTagNameMap>(selectors: K): Array<HTMLElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof SVGElementTagNameMap>(selectors: K): Array<SVGElementTagNameMap[K]>;
		querySelectorAllArray<K extends keyof MathMLElementTagNameMap>(selectors: K): Array<MathMLElementTagNameMap[K]>;
		querySelectorAllArray<E extends Element = Element>(selectors: string): Array<E>;
	}


	interface VueDivElement {
		$el: HTMLElement & {
			scrollToTop: (arg: number) => void;
			scrollToBottom: (arg: number) => void;
			scrollToPoint: (x?: number|null, y?: number|null, duration?: number) => void;
			scrollByPoint: (x?: number|null, y?: number|null, duration?: number) => void;
		};
	}
	interface VueSwiperElement {
		$el: HTMLElement & SwiperRef;
	}
	interface Array<T> {
		latest(): Array<T>;
	}
}
