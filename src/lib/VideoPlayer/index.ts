import { SyncPlugin } from './plugins/syncPlugin';
import { AutoSkipPlugin } from './plugins/autoSkipPlugin';
import { TVUIPlugin } from './plugins/UIPlugin/tvUIPlugin';
import { DesktopUIPlugin } from './plugins/UIPlugin/desktopUIPlugin';

import nmplayer from '@nomercy-entertainment/nomercy-video-player/src/index';
import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import OctopusPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/octopusPlugin';
import KeyHandlerPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/keyHandlerPlugin';
import type { NMPlayer, PlaylistItem, PlayerConfig, VTTData } from '@nomercy-entertainment/nomercy-video-player/src/types';

// // @ts-ignore
// import nmplayer from 'http://localhost:5503/src/index.ts';
// // @ts-ignore
// import Plugin from 'http://localhost:5503/src/plugin.ts';
// // @ts-ignore
// import { OctopusPlugin } from 'http://localhost:5503/src/plugins/octopusPlugin.ts';
// // @ts-ignore
// import { KeyHandlerPlugin } from 'http://localhost:5503/src/plugins/keyHandlerPlugin.ts';
// // @ts-ignore
// import type {NMPlayer, PlaylistItem, PlayerConfig, VTTData} from 'http://localhost:5503/src/index.d.ts';

export interface NMPlaylistItem extends PlaylistItem {
	origin:        string;
	video_id:      string;
	tmdb_id:       number;
	video_type:    string;
	playlist_type: string;
	fonts:         any[];
	fontsFile:     string;
	episode_id:    number;
}

export {
	nmplayer,
	SyncPlugin,
	AutoSkipPlugin,
	OctopusPlugin,
	DesktopUIPlugin,
	TVUIPlugin,
	KeyHandlerPlugin,
	NMPlayer,
	PlaylistItem,
	PlayerConfig,
	Plugin,
	VTTData,
}
