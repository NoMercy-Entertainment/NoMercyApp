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
// import nmplayer from 'https://vscode.nomercy.tv/src/index.ts';
// // @ts-ignore
// import Plugin from 'https://vscode.nomercy.tv/src/plugin.ts';
// // @ts-ignore
// import { OctopusPlugin } from 'https://vscode.nomercy.tv/src/plugins/octopusPlugin.ts';
// // @ts-ignore
// import { KeyHandlerPlugin } from 'https://vscode.nomercy.tv/src/plugins/keyHandlerPlugin.ts';
// // @ts-ignore
// import type {NMPlayer, PlaylistItem, PlayerConfig, VTTData} from 'https://vscode.nomercy.tv/src/index.d.ts';

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
