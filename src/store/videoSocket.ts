import { computed, ref, toRaw, watch } from 'vue';

import type SocketClient from '@/lib/clients/socketClient/SocketClient';
import type { HubConnection } from '@microsoft/signalr';

export const vc = ref(false);
export const videoSocketIsConnected = computed(() => vc.value);

const si = ref<SocketClient | undefined | null>();
export const videoSocketInstance = computed(() => si.value);

// @ts-ignore
window.videoSocketInstance = si;

export const videoSocketConnection = computed(() => si.value?.connection);
export function setVideoSocketInstance(value: SocketClient | null) {
	si.value = value;
}

export function useVideoSocket() {
	if (!si.value?.connection)
		return null;
	return toRaw(si.value?.connection) as HubConnection;
}

watch(si, (value) => {
	if (!value?.connection)
		return;
	value?.connection?.on('connected', connected);
	value?.connection?.on('disconnected', disconnected);
	value?.connection?.on('error', error);

	window.addEventListener(
		'beforeunload',
		() => {
			value?.connection?.stop();
		},
		{ once: true },
	);

	window.addEventListener(
		'unload',
		() => {
			value?.connection?.stop();
		},
		{ once: true },
	);
});

function connected() {
	vc.value = true;
	console.log('Connected to Video SignalR');
	document.dispatchEvent(new Event('videoHub-connected'));
}

function disconnected(err?: Event | void) {
	vc.value = false;
	console.log('Disconnected from Video SignalR', err);
	document.dispatchEvent(new Event('videoHub-disconnected'));
}

function error(err: Error) {
	vc.value = false;
	console.error('Video SignalR Error:', err);
	document.dispatchEvent(new Event('videoHub-error'));
}
