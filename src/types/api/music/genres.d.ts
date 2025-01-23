import type { ColorPalettes } from '@/types/api/shared';

export interface GenresResponse {
	type: string;
	data: GenreItem[];
}

export interface GenreItem {
	id: string;
	name: string;
	musicGenre_track: MusicGenreTrack[];
	color_palette: ColorPalettes;
	type: string;
	titleSort: string;
	origin: string;
	blurHash: string;
	link: string;
}

export interface MusicGenreTrack {
	musicGenre_id: string;
	track_id: string;
}
