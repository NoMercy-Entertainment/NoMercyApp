import { ref, watch } from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { setVideoSocketInstance } from '@/store/videoSocket';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';

const done = ref(false);
function initializeVideoSocket(): Promise<void> {
	return new Promise(async (resolve, reject) => {
		if (done.value) {
			return resolve();
		}
		done.value = true;

		if (
			!currentServer.value
			|| !user.value
			|| !user.value.features?.nomercyConnect
		) {
			user.value.features ??= {};
			user.value.features.nomercyConnect = false;
			return resolve();
		}

		let socket = new SocketClient(
			currentServer.value.serverBaseUrl,
			user.value.accessToken,
			'videoHub',
		);
		await socket.setup();
		setVideoSocketInstance(socket);

		setTimeout(() => {
			watch(currentServer, async (value) => {
				if (!value || !user.value || !socket)
					return;
				socket.connection?.stop();
				await socket.dispose();

				socket = new SocketClient(
					value.serverBaseUrl,
					user.value.accessToken,
					'videoHub',
				);
				await socket.setup();
				setVideoSocketInstance(socket);
			});
		}, 5000);

		return resolve();
	});
}

export default initializeVideoSocket;
