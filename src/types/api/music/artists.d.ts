import type { PaletteColors } from '../shared';

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

export interface Count {
	Album: number;
	track: number;
}
