import {RouteLocationNormalizedLoaded, useRoute} from "vue-router";
import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import type { NMPlayer } from "@nomercy-entertainment/nomercy-video-player/src/types";

import { useVideoSocket } from "@/store/videoSocket";
import type {NMPlaylistItem} from "@/lib/VideoPlayer";

export interface SyncPluginArgs {
	playlist: NMPlaylistItem[];
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

		const socket = useVideoSocket();
		socket?.invoke?.('SetTime', data);
	}

	ended() {
		const progress = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
		// and progress is 90% for a tv show and 80% for a movie
		if (this.player.isLastPlaylistItem() && this.player.playlistItem()?.playlist_type === 'tv' && progress >= 90) {
			const socket = useVideoSocket();
			socket?.invoke('RemoveWatched', this.episodeData()).then();
		}
		else if (this.player.isLastPlaylistItem() && this.player.playlistItem()?.playlist_type === 'movie' && progress >= 80) {
			const socket = useVideoSocket();
			socket?.invoke('RemoveWatched', this.episodeData()).then();
		}

		this.dispose();
		this.player.dispose();
	}

  episodeData() {
    const current = this.player.playlistItem();

    let path = this.route?.path;
    if (!path) {
      path = window.location.hash.replace("#", "");
    }
    if (!path) {
      path = location.pathname;
    }

    const route = path?.split("/");

    let specialId: string | undefined;
    let collectionId: number | undefined;
    let tmdbId: number | undefined =
        current?.tmdb_id ?? (route.at(-2) as string);
    if (route.at(-3) === "specials") {
      specialId = route.at(-2) as string;
    } else if (route.at(-3) === "collection") {
      collectionId = route.at(-2) as unknown as number;
      tmdbId = current.id as unknown as number;
    }

    return {
      video_id: current?.video_id,
      tmdb_id: tmdbId,
      playlist_type: route.at(-3),
      special_id: specialId,
      collection_id: collectionId,
      video_type: current?.video_type,
      // @ts-ignore
      time: Math.floor(this.player.getCurrentTime() || 0),
    };
  }

}
