import Plugin from  'nomercyplayer/dist/src/plugin';
import { NMPlayer } from  'nomercyplayer/dist/src';

export class MobileUIPlugin extends Plugin {
	player: any;

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		//
	}

	dispose() {
		//
	}
}
