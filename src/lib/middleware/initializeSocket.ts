import {ref, watch} from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { setSocketInstance, socketInstance } from '@/store/socket';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const done = ref(false);
const initializeSocket = (): Promise<void> => new Promise(async (resolve, reject) => {
	if (done.value) {
		return resolve();
	}
	done.value = true;

	if (!currentServer.value || !user.value) {
		return resolve();
	}

	let socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken);
	await socket.setup();
	setSocketInstance(socket);

	setTimeout(() => {
		watch(currentServer, async (value) => {
			if (!value || !user.value || !socket) return;
			socket.connection?.stop();
			await socket.dispose();

			socket = new SocketClient(value.serverBaseUrl, user.value.accessToken);
			await socket.setup();
			setSocketInstance(socket);
		});
	}, 5000);

	return resolve();
});

export default initializeSocket;

