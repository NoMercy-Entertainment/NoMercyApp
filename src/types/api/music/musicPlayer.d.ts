import type { Artist } from '@/types/api/music/artist';
import type { PlaylistItem } from "@/types/musicPlayer";
import type { ColorPalettes } from "@/types/api/shared";

export interface MusicCardPageResponseData {
	id: string;
	name: string;
	title: string;
	description: null;
	folder: string;
	cover: null | string;
	logo?: null | string;
	country: null | string;
	year: number | null;
	tracks: number;
	track: PlaylistItem[];
	color_palette: ColorPalettes | null;
	blurHash: null | string;
	libraryId: string;
	artists: Artist[];
	type: string;
	titleSort: string;
	origin: string;
	link: string;
	type: string;
}

export interface ArtistResponse {
	id: string;
	name: string;
	description: null;
	folder: string;
	cover: string;
	color_palette: ColorPalettes;
	blurHash: string;
	created_at: string;
	updated_at: string;
	library_id: string;
	library: string;
	type: string;
	tracks: PlaylistItem[];
}

export interface AlbumResponse {
	id: string;
	name: string;
	description: null;
	folder: string;
	cover: string;
	country: string;
	year: number;
	color_palette: ColorPalettes;
	blurHash: null;
	created_at: string;
	updated_at: string;
	library_id: string;
	library: string;
	artist: Artist;
	type: string;
	tracks: PlaylistItem[];
}

export interface DisplayList {
	id: string;
	name: string;
	description?: string | null;
	cover: string | null;
	backdrop: string | null;
	folder: string;
	color_palette: ColorPalettes;
	libraryId: string;
	trackId: null;
	tracks: PlaylistItem[];
	artists?: Artist[];
	media_type: string;
	year: number | null;
	artist: Artist;
	type: 'track' | 'album' | 'artist';
	favorite: boolean;
	link: string;
}

export interface MusicCardPageResponse {
	type: string;
	data: MusicCardPageResponseData[];
}

export interface MusicCardPageResponseData {
	id: string;
	name: string;
	title: string;
	description: null;
	folder: string;
	cover: null | string;
	logo?: null | string;
	country: null | string;
	year: number | null;
	tracks: number;
	track: PlaylistItem[];
	color_palette: ColorPalettes | null;
	blurHash: null | string;
	libraryId: string;
	artists: Artist[];
	type: string;
	titleSort: string;
	origin: string;
	link: string;
	type: string;
}
