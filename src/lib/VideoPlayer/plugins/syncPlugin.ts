import {NMPlayer, PlaylistItem} from '@/lib/VideoPlayer';
import Plugin from 'nomercyplayer/src/plugin';

import {useSocket} from '@/store/socket';

export class SyncPlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		this.player.on('lastTimeTrigger', this.lastTimeTrigger.bind(this));

		this.player.on('back', this.ended.bind(this));
		this.player.on('ended', this.ended.bind(this));
		this.player.on('finished', this.ended.bind(this));
	}

	dispose() {
		this.player.off('lastTimeTrigger', this.lastTimeTrigger.bind(this));

		this.player.off('back', this.ended.bind(this));
		this.player.off('ended', this.ended.bind(this));
		this.player.off('finished', this.ended.bind(this));
	}

	lastTimeTrigger(){
		console.log('lastTimeTrigger');
		const data = this.episodeData();

		const socket = useSocket();
		socket?.invoke?.('SetTime', data);
	}

	ended(){
		if (this.player.isLastPlaylistItem()) {
			const socket = useSocket();
			socket?.invoke('RemoveWatched', this.episodeData());
		}

		this.dispose();
		this.player.dispose();
	}

	episodeData() {
		const current = this.player.playlistItem() as  PlaylistItem & {
			tmdb_id: number,
			special_id: number,
			video_type: string,
			video_id: number;
		};

		const route = location.hash.split('/');

		let specialId: string|undefined;
		let collectionId: number|undefined;
		if (route.at(-3) === 'specials') {
			specialId = route.at(-2) as string;
		} else if (route.at(-3) === 'collection') {
			collectionId = route.at(-2) as unknown as number;
		}

		return {
			video_id: current?.video_id,
			tmdb_id: current?.tmdb_id,
			playlist_type: route.at(-3),
			special_id: specialId,
			collection_id: collectionId,
			video_type: current?.video_type,
			// @ts-ignore
			time: Math.floor(this.player.getCurrentTime() || 0),
		};
	}
}
