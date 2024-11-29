import {NMPlayer, Plugin} from '@/lib/VideoPlayer';

export class TemplatePlugin extends Plugin {
	player: NMPlayer | null = null;

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
