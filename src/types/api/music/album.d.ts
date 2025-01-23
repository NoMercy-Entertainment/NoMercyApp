import type { ColorPalettes } from '../shared';
import type { Artist } from '@/types/api/music/artist';
import { PlaylistItem } from '@/types/musicPlayer';

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
	track: PlaylistItem[];
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
	cover: string | null;
	country: string | null;
	year: number | null;
	tracks: number | null;
	color_palette: ColorPalettes | null;
	blurHash: string | null;
	library_id: string;
	disambiguation?: string | null;
	album_artist: string;
	link: string;
	type: string;
}
