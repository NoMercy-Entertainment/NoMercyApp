/// <reference types="vite/client" />

import {VueKeycloakInstance} from '@dsb-norge/vue-keycloak-js/dist/types';
import {SliderBar} from '@/lib/MusicPlayer/lib/sliderBar';

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

declare global {
	interface HTMLElement {
		sliderBar: (player: any, callbackFn: string, getSizeFn?: string) => SliderBar | null;
		scrollHorizontalIntoView: (parentElement?: HTMLElement) => void;
		scrollVerticalIntoView: (parentElement?: HTMLElement) => void;
		animateVerticalIntoView: (parentElement?: HTMLElement | null, duration?: number) => void;
	}
	interface Array<T> {
		latest(): Array<T>;
	}
}
