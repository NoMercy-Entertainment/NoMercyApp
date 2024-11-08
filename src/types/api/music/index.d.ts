import type { Album, Artist } from './album';
import type {ColorPalettes} from '@/types/api/shared';

export interface MusicHomeResponse {
	items: MusicHomeResponseItem[];
}

export interface MusicHomeResponseItem {
	title: string;
	moreLink: string;
	items: HomeDataItem[];
}

export interface HomeDataItem {
	id: string;
	name: string;
	title: string;
	description: string | null;
	cover: null | string;
	logo?: null | string;
	folder: string;
	color_palette: ColorPalettes | null;
	libraryId: string;
	trackId?: null;
	type: string;
	title_sort?: string;
	origin?: string;
	country?: string | null;
	year?: number | null;
	tracks?: number;
	Artist?: Artist[];
	Album?: Album[];
}

export interface Count {
	track: number;
	Artist?: number;
	File?: number;
	Album?: number;
}

export enum Type {
	Album = 'album',
	Artist = 'artist',
	Genre = 'genre',
	Playlist = 'playlist',
}
