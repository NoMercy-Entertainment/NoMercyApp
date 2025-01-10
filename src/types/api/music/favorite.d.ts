
import {PlaylistItem} from '@/types/musicPlayer';

export interface FavoritesResponse {
	cover: string;
	description: null;
	name: string;
	type: string;
	track: PlaylistItem[];
}

export interface Album {
	id: string;
	name: string;
	cover: string | null;
	description: string | null;
}
