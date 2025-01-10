import { SyncPlugin } from './plugins/syncPlugin';
import { AutoSkipPlugin } from './plugins/autoSkipPlugin';
import { TVUIPlugin } from './plugins/UIPlugin/tvUIPlugin';
import { DesktopUIPlugin } from './plugins/UIPlugin/desktopUIPlugin';

import nmplayer from 'nomercyplayer/src/index';
import Plugin from 'nomercyplayer/src/plugin';
import { OctopusPlugin } from 'nomercyplayer/src/plugins/octopusPlugin';
import { KeyHandlerPlugin } from 'nomercyplayer/src/plugins/keyHandlerPlugin';
import type {NMPlayer, PlaylistItem, SetupConfig, VTTData} from 'nomercyplayer/src/index.d';

// // @ts-ignore
// import nmplayer from 'https://vscode.nomercy.tv/src/index.ts';
// // @ts-ignore
// import Plugin from 'https://vscode.nomercy.tv/src/plugin.ts';
// // @ts-ignore
// import { OctopusPlugin } from 'https://vscode.nomercy.tv/src/plugins/octopusPlugin.ts';
// // @ts-ignore
// import { KeyHandlerPlugin } from 'https://vscode.nomercy.tv/src/plugins/keyHandlerPlugin.ts';
// // @ts-ignore
// import type {NMPlayer, PlaylistItem, SetupConfig, VTTData} from 'https://vscode.nomercy.tv/src/index.d.ts';

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
	SetupConfig,
	Plugin,
	VTTData,
}
