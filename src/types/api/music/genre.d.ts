import type {PaletteColors} from '../shared';
import type {Artist} from '@/types/api/music/artist';
import type {Album} from '@/types/api/music/album';

export interface GenreResponse {
	id: string;
	title: string;
	type: string;
	titleSort: string;
	origin: string;
	track: Track[];
    have_items: number;
}

export interface Track {
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
	Album: Album[];
	Artist: Artist[];
	type: string;
	favorite_track: boolean;
	artistId: string;
	origin: string;
	libraryId: string;
}
