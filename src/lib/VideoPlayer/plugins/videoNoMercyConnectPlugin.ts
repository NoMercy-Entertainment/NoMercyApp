import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useRoute } from 'vue-router';
import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player/src/types';

import { useVideoSocket } from '@/store/videoSocket';
import type { NMPlaylistItem } from '@/lib/VideoPlayer';
import { deviceId } from '@/store/deviceInfo.ts';
import type { Device } from '@/types/server.ts';
import type { PlayerState, StateEvents } from '@/types/videoPlayer.ts';
import type { HubConnection } from '@microsoft/signalr';
import router from '@/router';
import { setVideoPlayerState } from '@/store/videoPlayer.ts';

export interface VideoNoMercyConnectPluginArgs {
	playlist: NMPlaylistItem[];
}

export class VideoNoMercyConnectPlugin extends Plugin {
	player: NMPlayer<VideoNoMercyConnectPluginArgs> = <NMPlayer<VideoNoMercyConnectPluginArgs>>{};
	route: RouteLocationNormalizedLoaded<string | symbol> = <
        RouteLocationNormalizedLoaded<string | symbol>
        >{};

	playerState: PlayerState | undefined = undefined;
	connectedDevices: Device[] = [];
	currentVideoDeviceId: string | null = null;
	currentList: string | null = null;
	socket: HubConnection | null = null;

	async initialize(player: NMPlayer<VideoNoMercyConnectPluginArgs>) {
		this.player = player;
		this.socket = useVideoSocket();
	}

	use() {
		this.player.on('ready', this.ready.bind(this));
		this.player.on('dispose', this.handleDispose.bind(this));

		this.route = useRoute();
		this.socket?.on('VideoPlayerState', this.handleVideoPlayerState.bind(this));
		this.socket?.on('ConnectedDevicesState', this.handleVideoConnectedDevicesState.bind(this));
		this.socket?.on('ChangeDevice', this.handleVideoBroadcastStatus.bind(this));
	}

	dispose() {
		this.player.off('ready', this.ready.bind(this));
		this.player.off('dispose', this.handleDispose.bind(this));
		this.socket?.off('VideoPlayerState', this.handleVideoPlayerState.bind(this));
		this.socket?.off('ConnectedDevicesState', this.handleVideoConnectedDevicesState.bind(this));
		this.socket?.off('ChangeDevice', this.handleVideoBroadcastStatus.bind(this));
	}

	episodeData() {
		const current = this.player.playlistItem();

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
		let tmdbId: number | undefined
			= current?.tmdb_id ?? (route.at(-2) as string);
		if (route.at(-3) === 'specials') {
			specialId = route.at(-2) as string;
		}
		else if (route.at(-3) === 'collection') {
			collectionId = route.at(-2) as unknown as number;
			tmdbId = current.id as unknown as number ?? (route.at(-2) as string);
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

	ready() {
		const episodeData = this.episodeData();

		this.socket?.invoke(
			'StartPlaybackCommand',
			episodeData?.playlist_type,
			episodeData?.tmdb_id,
			episodeData?.tmdb_id,
		);
		this.socket?.invoke('Devices')
			.then(this.handleVideoConnectedDevicesState.bind(this));
	}

	handleDispose() {
		this.socket?.invoke('PlaybackCommand', 'stop', null);
	}

	handleVideoBroadcastStatus(data: any) {
		if (!data)
			return;
		for (const e of data.events) {
			const state = e.deviceBroadcastStatus;

			this.currentVideoDeviceId = state.device_id;

			if (state.device_id === deviceId.value) {
				this.player.setMute(false);
			}
			else {
				this.player.setMute(true);
			}
		}
	}

	handleVideoPlayerState(data: StateEvents) {
		if (!data)
			return;
		for (const e of data.events) {
			if (e.type !== 'PlayerStateChanged')
				continue;
			const state = e.event.state;
			this.playerState = state;

			setVideoPlayerState(state);

			console.log(state);

			if (state.current_list) {
				router.replace(state.current_list).then();
			}

			const offset = (Date.now() - state.timestamp) / 1000 / 2;
			const seekValue
				= state.progress_ms >= 1
					? (state.progress_ms + offset) / 1000
					: state.progress_ms / 1000;
			// const seekValue = state.progress_ms / 1000;

			this.currentVideoDeviceId = state.device_id;

			this.player.setVolume(state.volume_percentage);

			this.player.setMute(state.muted_state);

			this.setPlayState(state);

			this.player.once('seeked', () => {
				this.setPlayState(state);
			});

			this.player.on('item', () => {
				this.setPlayState(state);
			});

			this.setSeek(seekValue);

			this.player.on('playlist', () => {
				this.player.once('item', () => {
					this.setSeek(seekValue);
				});

				this.setItemFromIndex(state);
			});

			const playlist = this.player.getPlaylist();

			if (playlist.length === 0 || this.currentList != state.current_list) {
				this.currentList = state.current_list;
				this.player.setPlaylist(state.playlist);
			}
			else {
				this.setItemFromIndex(state);
			}

			setTimeout(() => {
				this.changeAudioTrack(state);
				this.changeCaptionTrack(state);
				this.changeQualityLevel(state);
			}, 150);

			this.player.on('audioTracks', () => {
				this.changeAudioTrack(state);
			});

			this.player.on('captionsList', () => {
				this.changeCaptionTrack(state);
			});

			this.player.on('levels', () => {
				this.changeQualityLevel(state);
			});
		}
	}

	private setSeek(seekValue: number) {
		if (seekValue !== 0 && Math.abs(this.player.getCurrentTime() - seekValue) > 0.75) {
			this.player.seek(seekValue);
		}
	}

	private setItemFromIndex(state: PlayerState) {
		const index = state.playlist.findIndex(
			pl => pl.video_id === state.item.video_id,
		);
		if (index !== this.player.getPlaylistIndex()) {
			this.player.playVideo(index);
		}
	}

	private setPlayState(state: PlayerState) {
		if (state.is_playing) {
			this.player.play().then();
		}
		else {
			this.player.pause();
		}
	}

	private changeQualityLevel(state: PlayerState) {
		if (state.current_quality?.width != null) {
			const index = this.player.getQualityLevels()
				.findIndex(c => c.width === state.current_quality.width);
			// console.log("Quality index: ", index, state.current_quality);
			if (index != null) {
				this.player.setCurrentQuality(index);
			}
		}
		else {
			this.player.setCurrentQuality(-1);
		}
	}

	private changeCaptionTrack(state: PlayerState) {
		if (state.current_caption?.language != null) {
			const index = this.player.getCaptionsList()
				.findIndex(c => c.language === state.current_caption.language && c.type === state.current_caption.type && c.ext === state.current_caption.codec);
			if (index != null) {
				this.player.setCurrentCaption(index - 1);
			}
		}
		else {
			this.player.setCurrentCaption(-1);
		}
	}

	private changeAudioTrack(state: PlayerState) {
		if (state.current_audio?.language != null) {
			const index = this.player.getAudioTracks()
				.findIndex(at => at.language === state.current_audio?.language);
			if (index != null) {
				this.player.setCurrentAudioTrack(index);
			}
		}
		else {
			this.player.setCurrentAudioTrack(-1);
		}
	}

	handleVideoConnectedDevicesState(devices: Device[]) {
		// console.log(devices);
		this.connectedDevices = devices;
	}
}
