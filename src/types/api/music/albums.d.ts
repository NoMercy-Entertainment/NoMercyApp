import type {Artist} from '@/types/api/music/artist';

export interface AlbumsResponse {
	type: string;
	data: AlbumData[];
}

interface AlbumData {
	id: string;
	name: string;
	description: string | null;
	folder: string | null;
	cover: null | string;
	country: null | string;
	year: number | null;
	tracks: number | null;
	color_palette: null | string;
	blurHash: null | string;
	libraryId: string;
	Artist: Artist[];
	type: string;
	titleSort: string;
	origin: string;
}
