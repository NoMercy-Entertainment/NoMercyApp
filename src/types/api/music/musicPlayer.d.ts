import type { LibraryItem } from '../base/library';
import type { ColorPalettes } from '../shared';
import { Album } from '@/types/api/music/album';
import { Artist } from '@/types/api/music/artist';
import {Song} from '@/types/musicPlayer';

export interface Music {
	playlists: any[];
	audio: HTMLAudioElement;
	backLog: Song[];
	// context: Context;
	currentSong: Song;
	currentSongIndex: number;
	crossfadeSteps: number;
	displayList: DisplayList;
	filteredList: Song[];
	durationState: number;
	fadeDuration: number;
	isCurrentDevice: boolean;
	lyrics: string;
	sortType: string;
	sortOrder: string;
	mutedState: string;
	playState: string;
	positionState: number;
	queue: Song[];
	showLyrics: boolean;
	shuffle: boolean;
	repeat: boolean;
	state: string;
	volumeState: number;
}

export interface MusicCardPageResponseData {
	id: string;
	name: string;
	title: string;
	description: null;
	folder: string;
	cover: null | string;
	logo?: null | string;
	country: null | string;
	year: number | null;
	tracks: number;
	track: Song[];
	color_palette: ColorPalettes | null;
	blurHash: null | string;
	libraryId: string;
	artists: Artist[];
	type: string;
	titleSort: string;
	origin: string;
	link: string;
}

export interface Lyric {
	text: string;
	time: Time;
}

export interface Time {
	total: number;
	minutes: number;
	seconds: number;
	hundredths: number;
}

export interface ArtistResponse {
	id: string;
	name: string;
	description: null;
	folder: string;
	cover: string;
	color_palette: ColorPalettes;
	blurHash: string;
	created_at: string;
	updated_at: string;
	library_id: string;
	library: string;
	type: string;
	tracks: Song[];
}

export interface AlbumResponse {
	id: string;
	name: string;
	description: null;
	folder: string;
	cover: string;
	country: string;
	year: number;
	color_palette: ColorPalettes;
	blurHash: null;
	created_at: string;
	updated_at: string;
	library_id: string;
	library: LibraryItem;
	artist: Artist;
	type: string;
	tracks: Song[];
}

export interface DisplayList {
	id: string;
	name: string;
	description?: string | null;
	cover: string | null;
	backdrop: string | null;
	folder: string;
	color_palette: ColorPalettes;
	libraryId: string;
	trackId: null;
	tracks: Song[];
	artists?: Artist[];
    media_type: string;
	year: number | null;
	artist: Artist;
	type: 'track' | 'album' | 'artist';
	favorite: boolean;
}
