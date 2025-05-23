import { HttpStatusCode } from 'axios';
import {
	ArtistLibrary,
	EncoderProfileLibrary,
	FolderLibrary,
	LibraryMovie,
	LibraryTv,
	LibraryUser
} from '@/types/api/base/library';
import { ColorPalettes } from '@/types/api/shared';

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


export interface Device {
	id: string;
	device_id: string;
	browser: string;
	os: string;
	device?: string;
	type: string;
	name: string;
	custom_name?: string;
	version: string;
	ip: string;
	activity_logs: ActivityLog[];

	is_active: boolean;
	volume_percent: number;

	created_at?: number;
	updated_at?: number;
}

export interface ActivityLog {
	id: string;
	user_id: string;
	device_id: string;
	type: string;
	device: number;
	user: number;
	time: number;
	from: string;
	created_at?: number;
	updated_at?: number;
}

export interface LogType {
	name: string;
	display_name: string;
	color: string;
	type: string;
}

export interface LogEntry {
	level: string;
	type: string;
	message: string;
	color: string;
	thread_id: number;
	time: Date;
}