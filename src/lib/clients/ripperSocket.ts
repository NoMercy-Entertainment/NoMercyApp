import { computed, type Ref, ref, watch } from 'vue';
import { HubConnectionState } from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const ripperSocket: Ref<SocketClient | undefined> = ref();
export const connection = computed(() => ripperSocket.value?.connection);
export const ripperSocketIsConnected = ref(false);

const connected = () => {
	ripperSocketIsConnected.value = true;
	document.dispatchEvent(new Event('ripperHub-connected'));

	if (ripperSocket.value?.connection) {
		onConnect(ripperSocket.value?.connection);
		connect(ripperSocket.value?.connection);
	}
};

const disconnected = (err?: Event | void) => {
	ripperSocketIsConnected.value = false;
	console.log('Disconnected from Ripper SignalR', err);
	document.dispatchEvent(new Event('ripperHub-disconnected'));
};

const error = (err: Error) => {
	ripperSocketIsConnected.value = false;
	console.error('Ripper SignalR Error:', err);
	document.dispatchEvent(new Event('ripperHub-error'));
}

watch(currentServer, async (newServer) => {
	const accessToken = user.value?.accessToken;

	if (newServer && ripperSocketIsConnected.value) {
		ripperSocket.value?.connection?.stop().then();
		ripperSocket.value?.dispose();
		ripperSocket.value = new SocketClient(currentServer.value!.serverBaseUrl!, accessToken, 'ripperHub');

		ripperSocket.value?.connection?.on('connected', connected);
		ripperSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);
	}
});

const connectToHub = async () => {
	if (ripperSocket.value?.connection?.state === HubConnectionState.Connected) return;

	return ripperSocket.value?.connection?.start()
		.then(connected);
};

export const stopRipperSocket = async () => {
	try {
		if (ripperSocket.value?.connection?.state === HubConnectionState.Disconnected) return;

		return ripperSocket.value?.connection?.stop()
			.then(disconnected)
			.catch(disconnected);

	} catch (err) {
		console.error('Error stopping Ripper SignalR:', err);
		disconnected();
	}
}

export const startRipperSocket = async () => {
	const accessToken = user.value?.accessToken;

	if (currentServer.value && (!ripperSocket.value?.connection?.state || ripperSocket.value?.connection?.state === HubConnectionState.Disconnected)) {
		ripperSocket.value = new SocketClient(currentServer.value.serverBaseUrl, accessToken, 'ripperHub');

		ripperSocket.value?.connection?.on('connected', connected);
		ripperSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);

		ripperSocket.value?.connection?.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(ripperSocket.value?.connection);
			disconnected();
		});
		ripperSocket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(ripperSocket.value?.connection);
			connected();
		});
	}
}
