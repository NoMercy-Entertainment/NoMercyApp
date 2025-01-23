import { watch } from 'vue';

import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import audioPlayer from '@/store/audioPlayer';

const initializeAudioPlayer = (): Promise<void> => {
	if (audioPlayer.accessToken) {
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		watch(currentServer, (server) => {
			if (!server) return;
			audioPlayer.setBaseUrl(server.serverBaseUrl);
			audioPlayer.setAccessToken(user.value.accessToken);
		});

		audioPlayer.setBaseUrl(currentServer.value?.serverBaseUrl);
		audioPlayer.setAccessToken(user.value.accessToken);

		document.addEventListener('click', () => {
			if (localStorage.getItem('supports-audio-context')) return;

			const audioContext = new AudioContext();
			// @ts-ignore
			audioContext.onerror = () => {
				localStorage.setItem('supports-audio-context', 'false');
				audioContext.close().then();
				location.reload();
			}
			audioContext.onstatechange = () => {
				console.log(audioContext.state);
				if (audioContext.state === 'running') {
					localStorage.setItem('supports-audio-context', 'true');
				} else if (audioContext.state === 'suspended') {
					audioContext.close().then();
					localStorage.setItem('supports-audio-context', 'false');
				}
			}
			audioContext.getOutputTimestamp()

			setTimeout(() => {
				audioContext.close().then();
			}, 100);
		});

		resolve();

	});
};

export default initializeAudioPlayer;
