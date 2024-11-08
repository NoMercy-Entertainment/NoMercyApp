import { watch } from 'vue';

import MusicPlayer from '@/lib/MusicPlayer';

import currentServer from '@/store/currentServer';
import user from '@/store/user';

const initializeAudioPlayer = (): Promise<void> => {

	return new Promise((resolve) => {
		const audioPlayer = new MusicPlayer();

		watch(currentServer, (server) => {
			if (!server) return;
			audioPlayer.setServerLocation(server.serverApiUrl);
			audioPlayer.setAccessToken(user.value.accessToken);
		});

		audioPlayer.setServerLocation(currentServer.value?.serverApiUrl);
		audioPlayer.setAccessToken(user.value.accessToken);

		resolve();

	});
};

export default initializeAudioPlayer;
