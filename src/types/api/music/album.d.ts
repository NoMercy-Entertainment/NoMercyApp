import type {ColorPalettes, PaletteColors} from '../shared';
import type {Artist} from '@/types/api/music/artist';

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
	libraryId: string;
	artist: Artist[] | null;
	_count: Count;
	type: string;
	track: Track[];
}

interface Count {
	track: number;
	Artist: number;
	File: number;
}

interface Track {
	id: string;
	name: string;
	track: number | null;
	disc: number | null;
	cover: string | null;
	date: string | null;
	folder: string | null;
	filename: string;
	duration: string | null;
	quality: number | null;
	path: string;
	color_palette: PaletteColors | null;
	blurHash: string | null;
	Artist: Artist[];
	Album: Album[];
	type: string;
	favorite_track: boolean;
	artistId: string;
	origin: string;
	libraryId: string;
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
	libraryId: string;
}
