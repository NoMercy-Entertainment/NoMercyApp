import type { PaletteColors } from '../shared';
import type { Count } from '@/types/api/music/index';

export interface ArtistsResponse {
	type: string;
	data: ArtistsData[];
}

export interface ArtistsData {
	id: string;
	name: string;
	description: null | string;
	cover: null | string;
	folder: null | string;
	color_palette: PaletteColors;
	libraryId: string;
	trackId: null | string;
	_count: Count;
	type: string;
	titleSort: string;
	origin: string;
}
