import {ref, watch} from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { setMusicSocketInstance } from '@/store/musicSocket';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const done = ref(false);
const initializeMusicSocket = (): Promise<void> => new Promise(async (resolve, reject) => {
	if (done.value) {
		return resolve();
	}
	done.value = true;

	if (!currentServer.value || !user.value || !user.value.features?.nomercyConnect) {
		user.value.features ??= {};
		user.value.features.nomercyConnect = false
		return resolve();
	}

	let socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken, 'musicHub');
	await socket.setup();
	setMusicSocketInstance(socket);

	setTimeout(() => {
		watch(currentServer, async (value) => {
			console.log('Current server changed, reinitializing music socket', value);
			if (!value || !user.value || !socket) return;
			socket.connection?.stop();
			await socket.dispose();

			socket = new SocketClient(value.serverBaseUrl, user.value.accessToken, 'musicHub');
			await socket.setup();
			setMusicSocketInstance(socket);
		});
	}, 5000);
	return resolve();
});

export default initializeMusicSocket;

