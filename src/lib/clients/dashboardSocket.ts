import { computed, type Ref, ref, watch } from 'vue';
import { HubConnectionState } from '@microsoft/signalr/src/HubConnection';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const dashboardSocket: Ref<SocketClient | undefined> = ref();
export const connection = computed(() => dashboardSocket.value?.connection);
export const dashboardSocketIsConnected = ref(false);

const connected = () => {
	dashboardSocketIsConnected.value = true;
	document.dispatchEvent(new Event('dashboardHub-connected'));

	if (dashboardSocket.value?.connection) {
		onConnect(dashboardSocket.value?.connection);
		connect(dashboardSocket.value?.connection);
	}
};

const disconnected = (err?: Event | void) => {
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
		dashboardSocket.value?.connection?.stop().then();
		dashboardSocket.value?.dispose();
		dashboardSocket.value = new SocketClient(currentServer.value!.serverBaseUrl!, accessToken, 'dashboardHub');

		dashboardSocket.value?.connection?.on('connected', connected);
		dashboardSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);
	}
});

const connectToHub = async () => {
	if (dashboardSocket.value?.connection?.state === HubConnectionState.Connected) return;

	return dashboardSocket.value?.connection?.start()
		.then(connected);
};

export const stopDashboardSocket = async () => {
	try {
		if (dashboardSocket.value?.connection?.state === HubConnectionState.Disconnected) return;

		return dashboardSocket.value?.connection?.stop()
			.then(disconnected)
			.catch(disconnected);

	} catch (err) {
		console.error('Error stopping Dashboard SignalR:', err);
		disconnected();
	}
}

export const startDashboardSocket = async () => {
	const accessToken = user.value?.accessToken;

	if (currentServer.value && (!dashboardSocket.value?.connection?.state || dashboardSocket.value?.connection?.state === HubConnectionState.Disconnected)) {
		dashboardSocket.value = new SocketClient(currentServer.value.serverBaseUrl, accessToken, 'dashboardHub');

		dashboardSocket.value?.connection?.on('connected', connected);
		dashboardSocket.value?.connection?.on('disconnected', disconnected);

		await connectToHub()
			.catch(error);

		dashboardSocket.value?.connection?.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(dashboardSocket.value?.connection);
			disconnected();
		});
		dashboardSocket.value?.connection?.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(dashboardSocket.value?.connection);
			connected();
		});
	}
}
