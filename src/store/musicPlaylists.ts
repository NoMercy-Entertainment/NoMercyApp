import { computed, ref } from 'vue';
import { Playlist } from '@/types/api/music/playlists';
import { PlaylistItem } from '@/types/musicPlayer';


const pl = ref<Playlist[]>([]);
export const musicPlaylist = computed(() => pl.value);

export function setMusicPlaylists(playlists: Playlist[]) {
	pl.value = playlists;
}

export const clearMusicPlaylist = () => {
	pl.value = [];
}

export const addToPlaylist = (id: string, song: PlaylistItem) => {
	const playlist = pl.value.find(p => p.id === id);
	if (playlist) {
		playlist.track.push(song);

		pl.value = [
			...pl.value.filter(p => p.id !== id),
			playlist
		];
	}
}

export const removeFromPlaylist = (id: string, song: PlaylistItem) => {
	const playlist = musicPlaylist.value.find(p => p.id === id);
	if (playlist) {
		playlist.track = playlist.track.filter((t: PlaylistItem) => t.id !== song.id);
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

