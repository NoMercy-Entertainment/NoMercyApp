import {computed, ref} from 'vue';
import {Playlist} from '@/types/api/music/playlists';
import {Song} from '@/types/musicPlayer';


const pl = ref<Playlist[]>([]);
export const musicPlaylist = computed(() => pl.value);

export function setMusicPlaylists(playlists: Playlist[]) {
	pl.value = playlists;
}

export const clearMusicPlaylist = () => {
	pl.value = [];
}

export const addToPlaylist = (id: string, song: Song) => {
	const playlist = pl.value.find(p => p.id === id);
	if (playlist) {
		playlist.track.push(song);

		pl.value = [
			...pl.value.filter(p => p.id !== id),
			playlist
		];
	}
}

export const removeFromPlaylist = (id: string, song: Song) => {
	const playlist = musicPlaylist.value.find(p => p.id === id);
	if (playlist) {
		playlist.track = playlist.track.filter((t: Song) => t.id !== song.id);
		pl.value = [
			...pl.value.filter(p => p.id !== id),
			playlist
		];
	}
}

export const removePlaylist = (id: string) => {
	pl.value = pl.value.filter(p => p.id !== id);
}

export const addPlaylist = (playlist: Playlist) => {
	pl.value = [
		...pl.value,
		playlist
	];
}

