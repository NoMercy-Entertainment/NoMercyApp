import { NMPlayer, Plugin } from '@/lib/VideoPlayer';

export class TemplatePlugin extends Plugin {
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
