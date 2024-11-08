import {HttpStatusCode} from 'axios';
import {
	ArtistLibrary,
	EncoderProfileLibrary,
	FolderLibrary,
	LibraryMovie,
	LibraryTv,
	LibraryUser
} from '@/types/api/base/library';
import {ColorPalettes} from '@/types/api/shared';

export interface ErrorResponse {
	type: string;
	title: string;
	status: HttpStatusCode,
	detail: string;
	instance: string;
	traceId: string;
}

export interface User {
	id?: string;
	user_id: string;
	name: string;
	email: string;
	enabled?: boolean;
	cache_id?: string;
	avatar?: string;
	is_owner?: boolean;
	manage?: boolean;
	owner?: boolean;
	allowed?: boolean;
	audio_transcoding?: boolean;
	video_transcoding?: boolean;
	no_transcoding?: boolean;
	created_at?: string;
	updated_at?: string;
	libraries?: string[];
	last_seen?: number;
}

export interface ServerLibrary {
	id: string;
	autoRefreshInterval: number;
	chapterImages: number;
	extractChapters: number;
	extractChaptersDuring: number;
	image: null | string;
	perfectSubtitleMatch: boolean;
	realtime: boolean;
	specialSeasonName: string;
	title: string;
	order: number;
	type: string;
	country: string;
	language: string;
	blurHash: null;
	color_palette: ColorPalettes;
	created_at: string;
	updated_at: string;
	folder_library: FolderLibrary[];
	language_library: any[];
	encoderProfile_library: EncoderProfileLibrary[];
	library_user: LibraryUser[];
	library_tv: LibraryTv[];
	library_movie: LibraryMovie[];
	collection_library: any[];
	artist_library: ArtistLibrary[];
	folders: string[];
	encoderProfiles: string[];
	subtitles: any[];
}

// export interface PaletteColors {
// 	dominant?: string;
// 	primary?: string;
// 	lightVibrant?: string;
// 	darkVibrant?: string;
// 	lightMuted?: string;
// 	darkMuted?: string;
// }
//
// export interface ColorPalettes {
// 	poster?: PaletteColors,
// 	backdrop?: PaletteColors,
// 	logo?: PaletteColors,
// 	image?: PaletteColors,
// 	profile?: PaletteColors,
// 	cover?: PaletteColors,
// }

export interface LogoResponse {
	aspectRatio?: string | number | null;
	src: string;
	color_palette?: ColorPalettes | null;
	meta?: {
		title: string | undefined;
		tags: string[] | undefined;
		logo: {
			aspectRatio: number | null;
			src: string;
		} | null;
	} | null;
}
