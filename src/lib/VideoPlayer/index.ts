import { SyncPlugin } from './plugins/syncPlugin';
import { AutoSkipPlugin } from './plugins/autoSkipPlugin';
// import { OctopusPlugin } from './plugins/octopusPlugin';

import nmplayer from 'nomercyplayer/src/index';
import { OctopusPlugin } from 'nomercyplayer/src/plugins/octopusPlugin';
import { TVUIPlugin } from 'nomercyplayer/src/plugins/tvUIPlugin';
import { DesktopUIPlugin } from 'nomercyplayer/src/plugins/desktopUIPlugin';
import { KeyHandlerPlugin } from 'nomercyplayer/src/plugins/keyHandlerPlugin';
import Plugin from 'nomercyplayer/src/plugin';
import type {NMPlayer, PlaylistItem, SetupConfig, VTTData} from 'nomercyplayer/src/index.d';

// import nmplayer from 'https://vscode.nomercy.tv/src/index.ts';
// import { OctopusPlugin } from 'https://vscode.nomercy.tv/src/plugins/octopusPlugin.ts';
// import { TVUIPlugin } from 'https://vscode.nomercy.tv/src/plugins/tvUIPlugin.ts';
// import { DesktopUIPlugin } from 'https://vscode.nomercy.tv/src/plugins/desktopUIPlugin.ts';
// import { KeyHandlerPlugin } from 'https://vscode.nomercy.tv/src/plugins/keyHandlerPlugin.ts';
// import Plugin from 'https://vscode.nomercy.tv/src/plugin.ts';
// import type {NMPlayer, PlaylistItem, SetupConfig, VTTData} from 'https://vscode.nomercy.tv/src/index.d.ts';

export {
	SyncPlugin,
	AutoSkipPlugin,
	OctopusPlugin,
	DesktopUIPlugin,
	TVUIPlugin,
	KeyHandlerPlugin,
	nmplayer,
	NMPlayer,
	PlaylistItem,
	SetupConfig,
	Plugin,
	VTTData,
}
