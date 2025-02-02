import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import type { NMPlayer, PlaylistItem } from "@nomercy-entertainment/nomercy-video-player/src/types";

import { useSocket } from "@/store/socket";
import {RouteLocationNormalizedLoaded, useRoute} from "vue-router";

export interface SyncPluginArgs {
	basePath: string;
	accessToken: string,
}

export class SyncPlugin extends Plugin {
	player: NMPlayer<SyncPluginArgs> = <NMPlayer<SyncPluginArgs>>{};
	route:  RouteLocationNormalizedLoaded<string | symbol> = <RouteLocationNormalizedLoaded<string | symbol>>{};

	async initialize(player: NMPlayer<SyncPluginArgs>) {
		this.player = player;
	}

	use() {
		this.player.on('lastTimeTrigger', this.lastTimeTrigger.bind(this));

		this.player.on('back', this.ended.bind(this));
		this.player.on('ended', this.ended.bind(this));
		this.player.on('finished', this.ended.bind(this));

		this.route = useRoute();
	}

	dispose() {
		this.player.off('lastTimeTrigger', this.lastTimeTrigger.bind(this));

		this.player.off('back', this.ended.bind(this));
		this.player.off('ended', this.ended.bind(this));
		this.player.off('finished', this.ended.bind(this));
	}

	lastTimeTrigger() {
		const data = this.episodeData();

		const socket = useSocket();
		socket?.invoke?.('SetTime', data);
	}

	ended() {
		if (this.player.isLastPlaylistItem()) {
			const socket = useSocket();
			socket?.invoke('RemoveWatched', this.episodeData());
		}

		this.dispose();
		this.player.dispose();
	}

	episodeData() {
		const current = this.player.playlistItem() as PlaylistItem & {
			tmdb_id: number,
			special_id: number,
			video_type: string,
			video_id: number;
		};

		let path = this.route?.path;
		if (!path) {
			path = window.location.hash.replace('#', '');
		}
		if (!path) {
			path = location.pathname;
		}

		const route = path?.split('/');

		let specialId: string | undefined;
		let collectionId: number | undefined;
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
