// @ts-nocheck
import { onMounted, onUnmounted, ref } from 'vue';
import type { CastContext, CastDevice, CastSession, MediaInfo } from '@/vite-env';
import { user } from '@/store/user';
import router from '@/router';
import { useRoute } from 'vue-router';

export function useChromecast() {
	const castContext = ref<CastContext>(
		window.cast?.framework.CastContext.getInstance(),
	);
	const currentDevice = ref<CastDevice | null>(null);
	const castSession = ref<CastSession | null>();
	const currentMedia = ref<MediaInfo | null>();

	const isCasting = ref(false);
	const isConnected = ref(false);

	const route = useRoute();

	onMounted(() => {
		if (!castContext.value)
			return;

		castContext.value.setOptions({
			receiverApplicationId: '925B4C3C',
			autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
		});

		console.raw('useChromecast', castContext.value);

		castContext.value.addEventListener(
			window.cast.framework.CastContextEventType.CONNECTED,
			(event) => {
				console.log('CastContext: CastState connected', event);
			},
		);

		castContext.value.addEventListener(
			window.cast.framework.CastContextEventType.DISCONNECTED,
			(event) => {
				console.log('CastContext: CastState disconnected', event);
			},
		);

		castContext.value.addEventListener(
			window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
			(event) => {
				console.log(`CastContext: CastState changed: ${event.castState}`);
			},
		);

		castContext.value.addEventListener(
			window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
			(event) => {
				console.log(
					`CastContext: SessionState changed: ${event.sessionState}`,
					event,
				);
				switch (event.sessionState) {
					case window.cast.framework.SessionState.SESSION_STARTED:
					case window.cast.framework.SessionState.SESSION_RESUMED:
						castContext.value = window.cast.framework.CastContext.getInstance();
						castSession.value = event.session;
						isConnected.value
							= event.sessionState
								=== window.cast.framework.SessionState.SESSION_RESUMED;
						isCasting.value = !!event.session;
						currentDevice.value = event.session.getCastDevice();
						currentMedia.value = event.session.getMediaSession();
						break;
					case window.cast.framework.SessionState.SESSION_ENDED:
						castContext.value = window.cast.framework.CastContext.getInstance();
						castSession.value = null;
						isConnected.value = false;
						isCasting.value = false;
						currentDevice.value = null;
						currentMedia.value = null;
						break;
				}
			},
		);
	});

	const startCasting = () => {
		console.raw('startCasting', castContext.value);
		castSession.value = null;
		window.chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
	};

	const stopCasting = () => {
		console.raw('stopCasting', castContext.value);

		window.cast.framework.CastContext.getInstance().endCurrentSession(true);

		castSession.value = null;
	};

	onUnmounted(() => {});

	function onRequestSessionSuccess(e: CastSession): void {
		castSession.value = e;
		console.log('onRequestSessionSuccess', e);
		isConnected.value = true;
		isCasting.value = true;
		currentDevice.value = e?.receiver;

		sendMedia('7Xdu1sAAAAASUVORK5CYII', 'video');
	}

	function onLaunchError(e: typeof window.cast.Error): void {
		console.error(e);
	}

	function onMediaDiscovered(media: MediaInfo): void {
		console.log('onMediaDiscovered', media);
		currentMedia.value = media;
	}

	function onMediaError(error: any): void {
		console.error('onMediaError', error);
	}

	function sendMedia(contentId: string, type: string) {
		console.log('sendMedia', contentId, type);

		const mediaInfo = new window.chrome.cast.media.MediaInfo(contentId, type);
		mediaInfo.customData = config;

		const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
		castSession.value?.loadMedia(request, onMediaDiscovered, onMediaError);
	}

	const config = {
		refreshToken:
      user.value?.refreshToken ?? localStorage.getItem('refresh_token'),
		redirectUrl: router.resolve({
			name: 'Watch',
			params: { id: 60808, type: 'tv' },
		}).path,
	};

	return {
		isCasting,
		isConnected,
		currentDevice,
		config,
		startCasting,
		stopCasting,
		sendMedia,
	};
}
