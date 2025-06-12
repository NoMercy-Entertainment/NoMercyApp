import type { ColorPalettes } from '../shared';
import type { EncoderProfile, FolderLibrary, User } from '@/types/server';
import type { Artist } from '@/types/api/music/artist';

export interface LibrariesResponse {
	id: string;
	autoRefreshInterval: number;
	chapterImages: number;
	extractChapters: number;
	extractChaptersDuring: number;
	image?: null | string;
	perfectSubtitleMatch: boolean;
	realtime: boolean;
	specialSeasonName: string;
	title: string;
	type: string;
	pagination: string;
	link: string;
	order: number;
	country: string;
	language: string;
	blurHash: null;
	color_palette: null;
	created_at: string;
	poster: string;
	overview: string;
	backdrop: string;
	logo: string;
	updated_at: string;
	folder_library: FolderLibrary[];
	subtitles: string[];
}

export interface Folder {
	id: string;
	path: string;
	encoder_profiles: EncoderProfile[];
	created_at: string;
	updated_at: string;
}

export interface LibraryResponse {
	id: number;
	backdrop: string;
	favorite: boolean;
	watched: boolean;
	logo: null | string;
	media_type: string;
	number_of_items: number;
	have_items: number;
	overview: string;
	color_palette: ColorPalettes;
	poster: string;
	title: string;
	titleSort: string;
	type: string;
	year: number;
	duration: number;
	link: string;
	tags: string[];
}

export interface StatusResponse<T> {
	status: string;
	message: string;
	args?: string[];
	data?: T;
}

export class CreateEncoderResponse {
	status: string;
	data: EncoderProfile;
}

export interface FolderLibrary {
	folder_id: string;
	library_id: string;
	folder: Folder;
}


export interface EncoderProfileLibrary {
	encoderProfile_id: string;
	library_id: string;
	encoderProfile: EncoderProfile;
}

export interface EncoderProfile {
	id: string;
	name: string;
	container: string;
	type: string;
	videoProfiles: VideoProfile[];
	audioProfiles: Profile[];
	subtitleProfiles: Profile[];
	encoder_profile_folder: null;
	created_at: Date;
	updated_at: Date;
}

export interface Profile {
	codec: string;
	channels?: number;
	segmentName: string;
	playlistName: string;
	allowedLanguages: string[];
	opts: any[];
	customArguments: any[];
}


export interface VideoProfile {
	codec: string;
	bitrate: number;
	width: number;
	height: number;
	framerate: number;
	preset: string;
	tune: string;
	segmentName: string;
	playlistName: string;
	colorSpace: string;
	crf: number;
	keyint: number;
	opts: any[];
	customArguments: CustomArgument[];
}

export interface CustomArgument {
	item1: string;
	item2: string;
}

export interface LibraryMovie {
	library_id: string;
	movie_id: number;
	movie: Movie;
}

export interface LibraryTv {
	library_id: string;
	tv_id: number;
	tv: Tv;
}

export interface LibraryUser {
	library_id: string;
	user_id: string;
	user: User;
}

export interface ArtistLibrary {
	artist_id: string;
	library_id: string;
	artist: Artist;
}
