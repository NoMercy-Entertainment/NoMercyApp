import type {ColorPalettes, PaletteColors} from '../shared';
import type {Song} from '@/types/api/music/musicPlayer';
import type {Genre} from '@/types/api/base/genre';
import type {Album} from '@/types/api/music/album';

export interface ArtistResponse {
	id: string;
	name: string;
	description: null | string;
	disambiguation: null | string;
	cover: null | string | undefined;
	folder: null | string;
	color_palette: ColorPalettes | null;
	blurHash: string | null;
	libraryId: string;
	trackId: null | string;
	_count: Count;
	type: string;
	media_type: undefined;
	favorite: boolean;
	tracks: Song[];
	favorite_tracks: Song[];
	playlists: Album[];
	albums: Album[];
	featured: Album[];
	artists: Artist[];
	images: Image[];
	genres: Genre[];
}

export interface Artist {
	id: string;
	name: string;
	description: string | null;
	cover: string | null;
	folder: string | null;
	color_palette: ColorPalettes | null;
	blurHash?: string | null;
	libraryId: string;
	trackId?: string | null;
	origin: string;
}

export interface Count {
	Album: number;
	track: number;
}

export interface Image {
	color_palette: {
		image: PaletteColors;
	},
	height: number;
	id: number;
	iso_639_1: null;
	src: string;
	type: 'banner' | 'background' | 'hdLogo' | 'logo' | 'thumb';
	voteAverage: number;
	voteCount: number;
	width: number;
}

export interface Featured {
	id: string;
	name: string;
	cover: string;
	color_palette: ColorPalettes;
}
