import {computed, type Ref, ref, watch} from 'vue';
import {HubConnectionState} from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import {connect, onConnect, onDisconnect} from '@/lib/clients/socketClient/events';
import {currentServer} from '@/store/currentServer';
import {user} from '@/store/user';

const socket: Ref<SocketClient| undefined> = ref();
export const connection = computed(() => socket.value?.connection);
export const dashboardSocketIsConnected = ref(false);

const connected = () => {
	dashboardSocketIsConnected.value = true;
	console.log('Connected to Dashboard SignalR');
	document.dispatchEvent(new Event('dashboardHub-connected'));

	if (socket.value?.connection) {
		onConnect(socket.value?.connection);
		connect(socket.value?.connection);
	}
};

const disconnected = (err?: Event|void) => {
	dashboardSocketIsConnected.value = false;
	console.log('Disconnected from Dashboard SignalR', err);
	document.dispatchEvent(new Event('dashboardHub-disconnected'));
};

const error = (err: Error) => {
	dashboardSocketIsConnected.value = false;
	console.error('Dashboard SignalR Error:', err);
	document.dispatchEvent(new Event('dashboardHub-error'));
}

watch(currentServer, async (newServer) => {
	const accessToken = user.value?.accessToken;

	if (newServer && dashboardSocketIsConnected.value) {
		socket.value?.connection?.stop().then();
		socket.value = new SocketClient(currentServer.value!.serverBaseUrl!, accessToken, 'dashboardHub');

		socket.value?.connection?.on('connected', connected);
		socket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);
	}
});

const connectToHub = async () => {
	if (socket.value?.connection?.state === HubConnectionState.Connected) return;

	return socket.value?.connection?.start()
		.then(connected);
};

export const stopDashboardSocket = async () => {
	try {
		if (socket.value?.connection?.state === HubConnectionState.Disconnected) return;

		return socket.value?.connection?.stop()
			.then(disconnected)
			.catch(disconnected);

	} catch (err) {
		console.error('Error stopping Dashboard SignalR:', err);
		disconnected();
	}
}

export const startDashboardSocket = async () => {
	const accessToken = user.value?.accessToken;

	if (currentServer.value && (!socket.value?.connection?.state || socket.value?.connection?.state === HubConnectionState.Disconnected)) {
		socket.value = new SocketClient(currentServer.value.serverBaseUrl, accessToken, 'dashboardHub');

		socket.value?.connection?.on('connected', connected);
		socket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);

		socket.value?.connection?.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(socket.value?.connection);
			disconnected();
		});
		socket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(socket.value?.connection);
			connected();
		});
	}
}
