import { Country, Language } from '@/types/api/shared';
import { InfoResponse } from '@/types/api/base/info';

export interface NameVal {
	title: string;
	value: string;
}

export interface DirectoryTreeResponse {
	status: string;
	data: DirectoryTreeItem[];
}

export interface DirectoryTreeItem {
	path: string;
	mode: number;
	size: number;
	type: string;
	parent: string;
	full_path: string;
}

export interface SystemPath {
	key: string;
	value: string;
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

export interface ServerInfo {
	server: string;
	os: string;
	arch: string;
	cpu: string[];
	gpu: string[];
	version: string;
	bootTime: number;
}

export interface ServerTask {
	id: string;
	title: string;
	value: number;
	type: string;
	created_at?: number;
	updated_at?: number;
}

export interface QueueResponse {
	id: number;
	payload_id: number;
	title: string;
	input_file: boolean;
	profile: boolean;
	status: string;
	type: string;
	priority: number;
}

export interface PauseResumeResponse {
	status: string;
	message: string;
}

export interface RunnersResponse {
	status: string;
	workers: number;
}

export interface PermissionsResponse {
	email: string;
	manage: boolean | number;
	owner: boolean;
	name: string;
	allowed: boolean;
	audioTranscoding: boolean;
	videoTranscoding: boolean;
	noTranscoding: boolean;
	created_at: string;
	updated_at: string;
	libraries: string[];
	allowedAllLibraries: boolean;
	enabled: boolean;
	// user_id: string;
	id: string;
}


export interface ServerEncoderProgress {
	id: number;
	process_id: number;
	title: string;
	value: any;
	has_gpu: boolean;
	is_hdr: boolean;
	seconds: number;
	minutes: number;
	hours: number;
	days: number;
	eta: string;
	speed: number | string;
	remaining_split: number[];
	subtitle_streams: string[];
	audio_streams: string[];
	video_streams: string[];
	progress: number;
	thumbnails: string;
	status: string;
	message: string;
}

export interface ConfigurationResponse {
	server_name: string;
	external_server_port: number;
	internal_server_port: number;
	queue_workers: number;
	cron_workers: number;
	data_workers: number;
	request_workers: number;
	encoder_workers: number;
	image_workers: number;
	swagger: boolean;
}

export interface Library {
	id: string;
	image?: string;
	title: string;
	type: string;
	folders: string[];
	language?: Language['iso_639_1'];
	country?: Country['iso_3166_1'];
	specialSeasonName: string;
	realtime: boolean;
	metadata?: {
		show: {
			name: string;
			val: string;
		}[];
		season: {
			name: string;
			val: string;
		}[];
		episode: {
			name: string;
			val: string;
		}[];
	};
	folder_library: {
		id: string;
		path: string;
		created_at?: number;
		updated_at?: number;
	}[];
	autoRefreshInterval: number;
	chapterImages: boolean;
	extractChapters: boolean;
	extractChaptersDuring: boolean;
	subtitles: Language['iso_639_1'][];
	perfectSubtitleMatch: boolean;
	encoderProfiles: string[];
	created_at?: number;
	updated_at?: number;
	content?: InfoResponse[];
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
	opts: string[];
	customArguments: string[];
}

export interface VideoProfile {
	codec: string;
	bitrate: number;
	width: number;
	height: number;
	framerate: number;
	preset: string;
	tune: string;
	profile: string;
	segmentName: string;
	playlistName: string;
	colorSpace: string;
	crf: number;
	keyint: number;
	opts: string[];
	customArguments: string[];
}

export interface Container {
	label: string;
	value: string;
	type: string;
	default: boolean;
	available_video_codecs: AvailableVideoCodec[];
	available_audio_codecs: AvailableAudioCodec[];
	available_subtitle_codecs: AvailableSubtitleCodec[];
	available_resolutions: AvailableResolution[];
}

export interface AvailableVideoCodec {
	name: string;
	value: string;
	simpleValue: string;
	isDefault: boolean;
	requiresGpu: boolean;
	requiresStrict: boolean;
	type: string;
	label: string;
	color_spaces: LabelValue[];
	profiles: LabelValue[];
	tunes: LabelValue[];
	presets: LabelValue[];
}

export interface AvailableAudioCodec {
	name: string;
	value: string;
	simpleValue: string;
	isDefault: boolean;
	requiresStrict: boolean;
	type: string;
	label: string;
	available_languages: LabelValue[];
	profiles: LabelValue[];
	tunes: LabelValue[];
}

export interface AvailableSubtitleCodec {
	name: string;
	value: string;
	simpleValue: string;
	isDefault: boolean;
	requiresStrict: boolean;
	type: string;
	label: string;
	available_languages: LabelValue[];
	profiles: LabelValue[];
	tunes: LabelValue[];
}

export interface AvailableResolution {
	name: string;
	width: number;
	height: number;
}

export interface LabelValue {
	label: string;
	value: string;
}

