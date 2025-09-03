import { computed, type Ref, ref, watch } from 'vue';
import { HubConnectionState } from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import {
	connect,
} from '@/lib/clients/socketClient/events';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const ripperSocket: Ref<SocketClient | undefined | null> = ref();
export const ripperSocketConnection = computed(() => ripperSocket.value?.connection);
export const ripperSocketIsConnected = ref(false);

export function setRipperSocketInstance(value: SocketClient | null) {
	ripperSocket.value = value;
}

function connected() {
	ripperSocketIsConnected.value = true;
	document.dispatchEvent(new Event('ripperHub-connected'));

	if (ripperSocket.value?.connection) {
		connect(ripperSocket.value?.connection);
	}
}

function disconnected(err?: Event | void) {
	ripperSocketIsConnected.value = false;
	console.log('Disconnected from Ripper SignalR', err);
	document.dispatchEvent(new Event('ripperHub-disconnected'));
}

function error(err: Error) {
	ripperSocketIsConnected.value = false;
	console.error('Ripper SignalR Error:', err);
	document.dispatchEvent(new Event('ripperHub-error'));
}

watch(currentServer, async (newServer) => {
	const accessToken = user.value?.accessToken;

	if (newServer && ripperSocketIsConnected.value) {
		ripperSocket.value?.connection?.stop().then();
		ripperSocket.value?.dispose();
		ripperSocket.value = new SocketClient(
			currentServer.value!.serverBaseUrl!,
			accessToken,
			'ripperHub',
		);

		ripperSocket.value?.connection?.on('connected', connected);
		ripperSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub().catch(error);
	}
});

async function connectToHub() {
	if (ripperSocket.value?.connection?.state === HubConnectionState.Connected)
		return;

	return ripperSocket.value?.connection?.start().then(connected);
}

export async function stopRipperSocket() {
	try {
		if (
			ripperSocket.value?.connection?.state === HubConnectionState.Disconnected
		)
			return;

		return ripperSocket.value?.connection
			?.stop()
			.then(disconnected)
			.catch(disconnected);
	}
	catch (err) {
		console.error('Error stopping Ripper SignalR:', err);
		disconnected();
	}
}

export async function startRipperSocket() {
	const accessToken = user.value?.accessToken;

	if (
		currentServer.value
		&& (!ripperSocket.value?.connection?.state
			|| ripperSocket.value?.connection?.state === HubConnectionState.Disconnected)
	) {
		ripperSocket.value = new SocketClient(
			currentServer.value.serverBaseUrl,
			accessToken,
			'ripperHub',
		);

		ripperSocket.value?.connection?.on('connected', connected);
		ripperSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub().catch(error);

		ripperSocket.value?.connection?.onreconnecting(
			(error: Error | undefined) => {
				console.log('SignalR Disconnected.', error?.message);
				disconnected();
			},
		);
		ripperSocket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			connected();
		});
	}
}
