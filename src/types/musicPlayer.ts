import {Artist} from '@/types/api/music/artist';
import {ColorPalettes, ServerLibrary} from '@/types/server';
import {Album} from '@/types/api/music/album';

export enum VisibilityState {
	hidden = 'hidden',
	showing = 'showing',
}

export enum SizeState {
	compact = 'compact',
	full = 'full',
}

export enum SortType {
	index = 'index',
	name = 'name',
	artist = 'artist',
	album = 'album',
	duration = 'duration',
	date = 'date',
}

export enum SortOrder {
	asc = 'asc',
	desc = 'desc',
}

export enum State {
	idle = 'idle',
	loading = 'loading',
	ready = 'ready',
	error = 'error',
}

export enum PlayState {
	paused = 'paused',
	playing = 'playing',
}

export enum MutedState {
	unmuted = 'unmuted',
	muted = 'muted',
}

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

export enum MusicType {
	artist = 'artist',
	album = 'album',
	playlist = 'playlist',
	search = 'search',
	genre = 'genre',
}


export interface MusicCardPageResponse {
	type: string;
	data: MusicCardPageResponseData[];
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
}

export interface Song {
	id: string;
	name: string;
	track: number;
	disc: number;
	cover: string;
	folder: string;
	filename: string;
	duration: string;
	quality: number;
	path: string;
    media_type: string;
	lyrics: Lyric[] | undefined;
	color_palette: ColorPalettes;
	blurHash: string;
	folder_id: string;
	created_at: string;
	updated_at: string;
	album_track: Album[];
	artist_track: Artist[];
	track_user: any[];
	type: string;
	favorite: boolean;
	origin: string;
	libraryId: string;
	date: string;
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
	library: ServerLibrary;
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
	library: ServerLibrary;
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
