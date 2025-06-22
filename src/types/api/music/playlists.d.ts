import type { PaletteColors } from '../shared';
import type { PlaylistItem } from '@/types/musicPlayer';

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
	track: PlaylistItem[];
	origin: string;
	type: string;
}
