import type { Track } from '@nomercy-entertainment/nomercy-video-player/src/types';
import type { ExtendedVideo } from '@/types/api/base/info';

export type TrailerButtonState = 'idle' | 'validating' | 'queued' | 'processing' | 'available' | 'unavailable';

export interface TrailerSubtitle {
	language: string;
	label: string;
	url: string;
}

export interface TrailerServiceResponse {
	success: boolean;
	status?: 'queued' | 'processing' | 'ready';
	data: {
		videoId: string;
		title: string;
		duration: number;
		width: number;
		height: number;
		cached: boolean;
		processing: boolean;
		downloadUrl: string;
		subtitles: TrailerSubtitle[];
	};
}

export interface ResolvedTrailer {
	videoId: string;
	videoUrl: string;
	thumbnailUrl: string;
	title: string;
	subtitles: Track[];
	sourceVideo: ExtendedVideo;
}
