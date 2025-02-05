import { watch } from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { setSocketInstance, socketInstance } from '@/store/socket';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const initializeSocket = async (): Promise<void> => {
	if (socketInstance.value?.connection) {
		return Promise.resolve();
	}

	if (!currentServer.value || !user.value) {
		return Promise.resolve();
	}

	const socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken);
	await socket.setup();
	setSocketInstance(socket);

	watch([currentServer, user], async () => {
		if (!currentServer.value || !user.value) return;
		socketInstance.value?.connection?.stop();
		socketInstance.value?.dispose();

		const socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken);
		await socket.setup();
		setSocketInstance(socket);
	});
}

export default initializeSocket;

