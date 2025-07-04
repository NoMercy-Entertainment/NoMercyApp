/// <reference types="vite/client" />
// src/types/chromecast.d.ts

/// <reference lib="webworker" />

import type { VueKeycloakInstance } from '@dsb-norge/vue-keycloak-js/dist/types';
import type { SliderBar } from '@/lib/sliderBar';
import type { SwiperRef } from 'swiper/swiper-react';

declare module '*.svg' {
	const src: string;
	export default src;
}
declare module '*.svg?import' {
	const src: string;
	export default src;
}
declare module '*.svg?url' {
	const src: string;
	export default src;
}
declare module '*.svg?raw' {
	const src: string;
	export default src;
}
declare module '*.svg?inline' {
	const src: string;
	export default src;
}
declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.png';
declare module '*.gif';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
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
		sliderBar: (
			player: any,
			callbackFn: string,
			getSizeFn?: string
		) => SliderBar | null;
		scrollHorizontalIntoView: (parentElement?: HTMLElement) => void;
		scrollVerticalIntoView: (parentElement?: HTMLElement) => void;
		animateVerticalIntoView: (
			parentElement?: HTMLElement | null,
			duration?: number
		) => void;
		firstChild: HTMLElement | null;
		lastChild: HTMLElement | null;
		children: HTMLCollection;
		isVisible: (parent?: HTMLElement) => boolean;
		onDoubleClick: ({
			singleClickEvtCallback,
			doubleClickEvtCallback,
		}: {
			singleClickEvtCallback: (event: MouseEvent) => void;
			doubleClickEvtCallback: (event: MouseEvent) => void;
		}) => void;
	}

	interface MouseEvent {
		target: HTMLElement & {
			scrollHorizontalIntoView: (parentElement?: HTMLElement) => void;
			scrollVerticalIntoView: (parentElement?: HTMLElement) => void;
			animateVerticalIntoView: (
				parentElement?: HTMLElement | null,
				duration?: number
			) => void;
			isVisible: (parent?: HTMLElement) => boolean;
		};
	}

	interface VueDivElement {
		$el: HTMLElement & {
			scrollToTop: (arg: number) => void;
			scrollToBottom: (arg: number) => void;
			scrollToPoint: (
				x?: number | null,
				y?: number | null,
				duration?: number
			) => void;
			scrollByPoint: (
				x?: number | null,
				y?: number | null,
				duration?: number
			) => void;
		};
	}
	interface VueSwiperElement {
		$el: HTMLElement & SwiperRef;
	}
}

declare global {
	interface Window {
		cast: {
			framework: {
				CastContext: typeof CastContext;
				CastContextEventType: typeof CastContextEventType;
				AutoJoinPolicy: typeof AutoJoinPolicy;
				CastState: typeof CastState;
				CastSession: CastSession;
				MediaInfo: MediaInfo;
				MediaMetadata: MediaMetadata;
				MediaStatus: MediaStatus;
				LoadRequest: LoadRequest;
				MetadataType: typeof MetadataType;
				PlayerState: typeof PlayerState;
				messages: {
					MediaMetadata: {
						// The constructor signature for MediaMetadata
						new (type: MetadataType): MediaMetadata;
						type: MetadataType;
					};
					MetadataType: typeof MetadataType;
					MediaInfo: MediaInfo;
				};
			};
		};
	}
}

interface CastContext {
	setOptions: (options: CastContextOptions) => void;
	addEventListener: (
		eventType: CastContextEventType,
		callback: (event: any) => void
	) => void;
	removeEventListener: (
		eventType: CastContextEventType,
		callback: (event: any) => void
	) => void;
	getCastState: () => CastState;
	getCurrentDevice: () => CastDevice | null;
	getSession: () => CastSession | null;
}

interface CastContextOptions {
	receiverApplicationId: string;
	autoJoinPolicy: AutoJoinPolicy;
}

enum CastContextEventType {
	CAST_STATE_CHANGED = 'cast_state_changed',
}

enum AutoJoinPolicy {
	ORIGIN_SCOPED = 'origin_scoped',
}

enum CastState {
	NOT_CONNECTED = 'not_connected',
	CONNECTED = 'connected',
}

interface CastDevice {
	friendlyName: string;
}

interface CastSession {
	loadMedia: (
		mediaInfo: MediaInfo,
		onSuccess?: (result: any) => void,
		onFailure?: (error: any) => void
	) => void;
	end: (
		onSuccess?: (result: any) => void,
		onFailure?: (error: any) => void
	) => void;
}

interface MediaInfo {
	contentId: string;
	contentType: string;
	metadata: MediaMetadata;
	streamType?: string;
	customData?: any;
}

interface MediaMetadata {
	// The constructor signature for MediaMetadata
	type: MetadataType;
}

enum MetadataType {
	VIDEO = 1,
	AUDIO = 2,
}

enum PlayerState {
	IDLE = 'IDLE',
	PLAYING = 'PLAYING',
	PAUSED = 'PAUSED',
}

interface MediaStatus {
	playerState: PlayerState;
}

interface LoadRequest {
	media: MediaInfo;
	autoplay: boolean;
	currentTime: number;
}
