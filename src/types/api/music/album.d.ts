import type {ColorPalettes, PaletteColors} from '../shared';
import type {Artist} from '@/types/api/music/artist';
import {Song} from '@/types/musicPlayer';

export interface AlbumResponse {
	id: string;
	name: string;
	description: string | null;
	folder: string | null;
	cover: string | null;
	country: string | null;
	year: number | null;
	tracks: number | null;
	color_palette: ColorPalettes | null;
	blurHash: string | null;
	library_id: string;
	artist: Artist[] | null;
	_count: Count;
	type: string;
	track: Song[];
}

interface Count {
	track: number;
	Artist: number;
	File: number;
}

interface Album {
	id: string;
	name: string;
	description: string | null;
	folder: string | null;
    type: string;
	cover: string | null;
	country: string | null;
	year: number | null;
	tracks: number | null;
	color_palette: ColorPalettes | null;
	blurHash: string | null;
	library_id: string;
	disambiguation?: string | null;
	origin: string;
	album_artist: string;
	link: string;
}
