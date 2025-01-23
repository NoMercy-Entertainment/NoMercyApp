import { computed, type Ref, ref, watch } from 'vue';
import { HubConnectionState } from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const castSocket: Ref<SocketClient | undefined> = ref();
export const connection = computed(() => castSocket.value?.connection);
export const castSocketIsConnected = ref(false);

const connected = () => {
	castSocketIsConnected.value = true;
	console.log('Connected to Cast SignalR');
	document.dispatchEvent(new Event('castHub-connected'));

	if (castSocket.value?.connection) {
		onConnect(castSocket.value?.connection);
		connect(castSocket.value?.connection);
	}
};

const disconnected = (err?: Event | void) => {
	castSocketIsConnected.value = false;
	console.log('Disconnected from Cast SignalR', err);
	document.dispatchEvent(new Event('castHub-disconnected'));
};

const error = (err: Error) => {
	castSocketIsConnected.value = false;
	console.error('Cast SignalR Error:', err);
	document.dispatchEvent(new Event('castHub-error'));
}

watch(currentServer, async (newServer) => {
	const accessToken = user.value?.accessToken;

	if (newServer && castSocketIsConnected.value) {
		castSocket.value?.connection?.stop().then();
		castSocket.value = new SocketClient(currentServer.value!.serverBaseUrl!, accessToken, 'castHub');

		castSocket.value?.connection?.on('connected', connected);
		castSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);
	}
});

const connectToHub = async () => {
	if (castSocket.value?.connection?.state === HubConnectionState.Connected) return;

	return castSocket.value?.connection?.start()
		.then(connected);
};

export const stopCastSocket = async () => {
	try {
		if (castSocket.value?.connection?.state === HubConnectionState.Disconnected) return;

		return castSocket.value?.connection?.stop()
			.then(disconnected)
			.catch(disconnected);

	} catch (err) {
		console.error('Error stopping Cast SignalR:', err);
		disconnected();
	}
}

export const startCastSocket = async () => {
	const accessToken = user.value?.accessToken;

	if (currentServer.value && (!castSocket.value?.connection?.state || castSocket.value?.connection?.state === HubConnectionState.Disconnected)) {
		castSocket.value = new SocketClient(currentServer.value.serverBaseUrl, accessToken, 'castHub');

		castSocket.value?.connection?.on('connected', connected);
		castSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);

		castSocket.value?.connection?.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(castSocket.value?.connection);
			disconnected();
		});
		castSocket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(castSocket.value?.connection);
			connected();
		});
	}
}
