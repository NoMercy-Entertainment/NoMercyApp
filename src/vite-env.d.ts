/// <reference types="vite/client" />

import {VueKeycloakInstance} from '@dsb-norge/vue-keycloak-js/dist/types';
import {SliderBar} from '@/lib/MusicPlayer/lib/sliderBar';
import {ScrollBaseDetail} from '@ionic/core/dist/types/components/content/content-interface';

declare module '*.svg'
declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.png';
declare module '*.gif';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties  {
		$keycloak: VueKeycloakInstance;
		$t: (key: string) => string;
	}
}

declare interface VueScrollEvent {
	srcElement: HTMLElement;
	target: HTMLElement;
}

declare global {
	interface HTMLElement {
		sliderBar: (player: any, callbackFn: string, getSizeFn?: string) => SliderBar | null;
		scrollHorizontalIntoView: (parentElement?: HTMLElement) => void;
		scrollVerticalIntoView: (parentElement?: HTMLElement) => void;
		animateVerticalIntoView: (parentElement?: HTMLElement | null, duration?: number) => void;
		firstChild: HTMLElement | null;
		lastChild: HTMLElement | null;
		children: HTMLCollection;
	}
	interface VueDivElement {
		$el: HTMLElement;
	}
	interface Array<T> {
		latest(): Array<T>;
	}
}
