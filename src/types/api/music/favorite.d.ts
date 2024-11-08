import type { PaletteColors } from '@/types/shared';
import type {Artist} from '@/types/api/music/artist';

export interface FavoritesResponse {
	cover: string;
	description: null;
	name: string;
	type: string;
	track: Track[];
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
	lyrics: string | undefined | null;
	color_palette: PaletteColors;
	blurHash: string | null;
	Artist: Album;
	Album: Album;
	FavoriteTrack: FavoriteTrack[];
	type: string;
	favorite_track: boolean;
	libraryId: string;
	artistId: string;
	origin: string;
	artists: Artist[];
}

export interface Album {
	id: string;
	name: string;
	cover: string | null;
	description: string | null;
}

export interface FavoriteTrack {
	trackId: string;
	userId: string;
	created_at: Date;
	updated_at: Date;
}
