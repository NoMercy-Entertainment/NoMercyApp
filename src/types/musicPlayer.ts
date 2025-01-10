import type {ColorPalettes} from '@/types/api/shared';
import type {Artist} from '@/types/api/music/artist';
import type {Album} from '@/types/api/music/album';
import type {DisplayList} from "@/types/api/music/musicPlayer";

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

export interface Music {
	playlists: any[];
	audio: HTMLAudioElement;
	backLog: PlaylistItem[];
	currentSong: PlaylistItem;
	currentSongIndex: number;
	crossFadeSteps: number;
	displayList: DisplayList;
	filteredList: PlaylistItem[];
	durationState: number;
	fadeDuration: number;
	isCurrentDevice: boolean;
	lyrics: string;
	sortType: string;
	sortOrder: string;
	mutedState: string;
	playState: string;
	positionState: number;
	queue: PlaylistItem[];
	showLyrics: boolean;
	shuffle: boolean;
	repeat: boolean;
	state: string;
	volumeState: number;
}

export interface BasePlaylistItem {
  id: string;
  name: string;
  cover: string | null;
  path: string;
  disc: number;
  track: number;
  album_track: {
	id: string;
	name: string;
	cover: string | null;
	[key: string]: any;
  }[];
  artist_track: {
	id: string;
	name: string;
	cover: string | null;
	[key: string]: any;
  }[];
  [key: string]: any;
}

export interface PlaylistItem extends BasePlaylistItem {
	duration: string;
	quality: number;
	lyrics?: Lyric[] | null;
	color_palette: ColorPalettes;
	blurHash: string;
	created_at: string;
	updated_at: string;
	album_track: Album[];
	artist_track: Artist[];
	track_user: any[];
	favorite: boolean;
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