import {ref, UnwrapRef, watch} from 'vue';

import type MusicPlayer from '@/lib/MusicPlayer';
import type PlayerCore from '@/lib/MusicPlayer';
import {SizeState, Song, VisibilityState} from '@/types/musicPlayer';
import {RepeatState} from '@/lib/MusicPlayer/lib/types';

const audioPlayer = ref<MusicPlayer>(<MusicPlayer>{});
export const setAudioPlayer = (player: MusicPlayer): void => {
	audioPlayer.value = player;
}
export const getAudioPlayer = (): UnwrapRef<PlayerCore> => {
	return audioPlayer.value!;
}
export default audioPlayer;

export const lyricsMenuOpen = ref<boolean>(false);
export const setLyricsMenuOpen = (value: boolean): void => {
	lyricsMenuOpen.value = value;
}
export const toggleLyricsMenuOpen = (): void => {
	lyricsMenuOpen.value = !lyricsMenuOpen.value;
}

export const hasLyrics = ref<boolean>(false);
export const setHasLyrics = (value: boolean): void => {
	hasLyrics.value = value;
}

export const deviceMenuOpen = ref<boolean>(false);
export const setDeviceMenuOpen = (value: boolean): void => {
	deviceMenuOpen.value = value;
}
export const toggleDeviceMenuOpen = (): void => {
	deviceMenuOpen.value = !deviceMenuOpen.value;
}

export const currentTime = ref<number>(0);
export const duration = ref<number>(0);
export const remainingTime = ref<number>(0);
export const percentage = ref<number>(0);
export const currentSong = ref<Song|null>(null);
export const currentPlaylist = ref<string|null>(null);
export const queue = ref<Song[]>([]);
export const backlog = ref<Song[]>([]);
export const isPlaying = ref<boolean>(false);
export const isMuted = ref<boolean>(false);
export const isShuffling = ref<boolean>(false);
export const isRepeating = ref<RepeatState>('off');
export const volume = ref<number>(0);

export const setCurrentPlaylist = (value: string): void => {
	currentPlaylist.value = value;
}

watch(audioPlayer, (value) => {
	if (!value) return;

	value?.on('time', (timeState) => {
		currentTime.value = timeState.position;
		duration.value = timeState.duration;
		remainingTime.value = timeState.remaining;
		percentage.value = timeState.percentage
	});
	value?.on('song', (data) => {
		currentSong.value = data;
	});

	value?.on('queue', (data:Song[]) => {
		queue.value = data;
	});

	value?.on('backlog', (data:Song[]) => {
		backlog.value = data;
	});

	value?.on('play', () => {
		isPlaying.value = true;
	});
	value?.on('pause', () => {
		isPlaying.value = false;
	});
	value?.on('stop', () => {
		isPlaying.value = false;
	});

	value?.on('mute', (value) => {
		isMuted.value = value;
	});

	value?.on('shuffle', (value) => {
		isShuffling.value = value;
	});

	value?.on('repeat', (value) => {
		isRepeating.value = value;
	});

	value?.on('volume', (value) => {
		volume.value = value;
	});
});

export const queueMenuOpen = ref<boolean>(false);
export const setQueueMenuOpen = (value: boolean): void => {
	queueMenuOpen.value = value;
}
export const toggleQueueMenuOpen = (): void => {
	queueMenuOpen.value = !queueMenuOpen.value;
}

export const musicVisibility = ref<VisibilityState>(VisibilityState.hidden);
export const setMusicVisibility = (value: VisibilityState): void => {
	musicVisibility.value = value;
}

export const musicSize = ref<SizeState>(SizeState.compact);
export const setMusicSize = (value: SizeState): void => {
	musicSize.value = value;
}
