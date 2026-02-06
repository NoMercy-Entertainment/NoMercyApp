import { SyncPlugin } from './plugins/syncPlugin';
import { AutoSkipPlugin } from './plugins/autoSkipPlugin';
import { DesktopUIPlugin } from './plugins/UIPlugin/desktopUIPlugin';

import nmplayer from '@nomercy-entertainment/nomercy-video-player/src/index';
import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import OctopusPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/octopusPlugin';
import KeyHandlerPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/keyHandlerPlugin';
import type {
	Level,
	NMPlayer,
	PlayerConfig,
	PlaylistItem,
	Track,
	VTTData,
} from '@nomercy-entertainment/nomercy-video-player/src/types';

export interface NMPlaylistItem extends PlaylistItem {
	origin: string;
	video_id: string;
	tmdb_id: number;
	video_type: string;
	playlist_type: string;
	fonts: { name: string; url: string }[];
	fontsFile: string;
	episode_id: number;
	audio: Track[];
	captions: Track[];
	qualities: Level[];
}

export {
	AutoSkipPlugin,
	DesktopUIPlugin,
	KeyHandlerPlugin,
	nmplayer,
	NMPlayer,
	OctopusPlugin,
	PlayerConfig,
	PlaylistItem,
	Plugin,
	SyncPlugin,
	VTTData,
};
