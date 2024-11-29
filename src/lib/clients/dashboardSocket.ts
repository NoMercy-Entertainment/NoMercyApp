import {computed, type Ref, ref, watch} from 'vue';
import {HubConnectionState} from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import {connect, onConnect, onDisconnect} from '@/lib/clients/socketClient/events';
import {currentServer} from '@/store/currentServer';
import {user} from '@/store/user';

const socket: Ref<SocketClient| undefined> = ref();
export const connection = computed(() => socket.value?.connection);
export const isConnected = ref(false);

const connected = () => {
	isConnected.value = true;
	console.log('Connected to SignalR');
	document.dispatchEvent(new Event('dashboardHub-connected'));
};

const disconnected = () => {
	isConnected.value = false;
	console.log('Disconnected from SignalR');
	document.dispatchEvent(new Event('dashboardHub-disconnected'));
};

watch(currentServer, async (newServer) => {
	const accessToken = user.value?.accessToken;

	if (newServer) {
		socket.value?.connection?.stop().then();
		socket.value = new SocketClient(currentServer.value!.serverBaseUrl!, accessToken, 'dashboardHub');

		socket.value?.connection?.on('connected', connected);
		socket.value?.connection?.on('disconnected', disconnected);

		await connectToHub();
	}
});

const connectToHub = async () => {
	try {
		await socket.value?.connection?.start();
	} catch (err) {
		console.error('SignalR Connection Error:', err);
	}
};

export const stopDashboardSocket = () => {
	socket.value?.connection?.stop().then();
}

export const startDashboardSocket = async () => {
	const accessToken = user.value?.accessToken;

	if (currentServer.value && socket.value?.connection?.state === HubConnectionState.Disconnected) {
		socket.value = new SocketClient(currentServer.value.serverBaseUrl, accessToken, 'dashboardHub');

		socket.value?.connection?.on('connected', connected);
		socket.value?.connection?.on('disconnected', disconnected);

		connectToHub().then();

		socket.value?.connection?.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(socket.value?.connection);
		});
		socket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(socket.value?.connection);
		});
		socket.value?.connection?.onclose(() => {
			console.log('SignalR Closed.');
			onDisconnect(socket.value?.connection);
		});

		await socket.value?.connection?.start();

		if (socket.value?.connection) {
			onConnect(socket.value?.connection);
			connect(socket.value?.connection);
		}
	}
}
