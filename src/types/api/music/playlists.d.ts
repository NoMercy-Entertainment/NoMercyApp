import type { Song } from '@/types/api/music/musicPlayer';
import type { PaletteColors } from '../shared';

export interface PlaylistsResponse {
	type: string;
	data: Playlist[];
}

export interface Playlist {
	id: string;
	userId: string;
	name: string;
	description: string;
	cover: null;
	color_palette: PaletteColors;
	blurHash: null;
	created_at: string;
	updated_at: string;
	track: Song[];
	origin: string;
	type: string;
}
