import { watch } from 'vue';

import MusicPlayer from '@/lib/MusicPlayer';

import currentServer from '@/store/currentServer';
import user from '@/store/user';
import audioPlayer, {setAudioPlayer} from '@/store/audioPlayer';

const initializeAudioPlayer = (): Promise<void> => {
	if (audioPlayer.value?.accessToken) {
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		setAudioPlayer(new MusicPlayer());

		watch(currentServer, (server) => {
			if (!server) return;
			audioPlayer.value?.setServerLocation(server.serverBaseUrl);
			audioPlayer.value?.setAccessToken(user.value.accessToken);
		});

		audioPlayer.value?.setServerLocation(currentServer.value?.serverBaseUrl);
		audioPlayer.value?.setAccessToken(user.value.accessToken);

		resolve();

	});
};

export default initializeAudioPlayer;
