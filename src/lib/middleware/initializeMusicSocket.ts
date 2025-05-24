import { watch } from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { setMusicSocketInstance, musicSocketInstance } from '@/store/musicSocket';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const initializeMusicSocket = async (): Promise<void> => {
	if (musicSocketInstance.value?.connection) {
		return Promise.resolve();
	}

	if (!currentServer.value || !user.value || !user.value.features?.nomercyConnect) {
		user.value.features ??= {};
		user.value.features.nomercyConnect = false
		return Promise.resolve();
	}

	const socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken, 'musicHub');
	await socket.setup();
	setMusicSocketInstance(socket);

	watch([currentServer, user], async () => {
		if (!currentServer.value || !user.value) return;
		musicSocketInstance.value?.connection?.stop();
		musicSocketInstance.value?.dispose();

		const socket = new SocketClient(currentServer.value.serverBaseUrl, user.value.accessToken, 'musicHub');
		await socket.setup();
		setMusicSocketInstance(socket);
	});
}

export default initializeMusicSocket;

