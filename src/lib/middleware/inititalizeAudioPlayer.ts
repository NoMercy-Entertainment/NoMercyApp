import { watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';

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

		const supportsAudioContext = useLocalStorage('nmplayer-supports-audio-context', false);

		document.addEventListener('click', () => {
			if (!supportsAudioContext) return;

			const audioContext = new AudioContext();
			// @ts-ignore
			audioContext.onerror = () => {
				supportsAudioContext.value = false;
				audioContext.close().then();
				location.reload();
			}
			audioContext.onstatechange = () => {
				console.log(audioContext.state);
				if (audioContext.state === 'running') {
					supportsAudioContext.value = true;
				} else if (audioContext.state === 'suspended') {
					audioContext.close().then();
					supportsAudioContext.value = false;
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
