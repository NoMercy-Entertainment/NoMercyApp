import Plugin from  '@nomercy-entertainment/nomercy-video-player/src/plugin';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player/src/types';

export class MobileUIPlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};

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
