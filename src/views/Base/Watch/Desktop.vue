<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { IonPage, isPlatform } from '@ionic/vue';

import { setDisableScreensaver } from '@/store/imageModal';

import type {
	NMPlayer,
	NMPlaylistItem,
	PlayerConfig,
	PlaylistItem,
} from '@/lib/VideoPlayer';
import {
	SyncPlugin,
} from '@/lib/VideoPlayer';
import {
	AutoSkipPlugin,
	DesktopUIPlugin,
	nmplayer,
	OctopusPlugin,
} from '@/lib/VideoPlayer';
import router from '@/router';
import audioPlayer from '@/store/audioPlayer';

import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import KeyHandlerPlugin from '@/lib/VideoPlayer/plugins/keyHandlerPlugin.ts';
import useServerClient from '@/lib/clients/useServerClient.ts';
import { VideoNoMercyConnectPlugin } from '@/lib/VideoPlayer/plugins/videoNoMercyConnectPlugin.ts';

const { data } = useServerClient<NMPlaylistItem[]>({
	enabled: !false,
});

const player = ref<NMPlayer<PlaylistItem>>();

function initPlayer(value?: NMPlaylistItem[] | undefined) {
	const config: Partial<PlayerConfig<PlaylistItem>> = {
		muted: false,
		controls: false,
		preload: 'auto',
		debug: false,
		autoPlay: true,
		playlist: value?.filter(item => !!item.id) ?? [],
		controlsTimeout: 3000,
		doubleClickDelay: 300,
		playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
		accessToken: user.value?.accessToken,
		basePath: currentServer.value?.serverBaseUrl,
		forceTvMode:
      (isPlatform('android') || isPlatform('ios')) && !isPlatform('mobile'),
		disableTouchControls: false,
		disableMediaControls:
      'mediaSession' in navigator || isPlatform('capacitor'),
		renderAhead: 100,
		disableAutoPlayback: false,
	} satisfies PlayerConfig<PlaylistItem>;

	// @ts-ignore
	player.value = nmplayer('player1').setup(config);

	player.value?.once('back', () => {
		router.back();
	});

	if (false) {
		const videoNoMercyConnectPlugin = new VideoNoMercyConnectPlugin();
		player.value?.registerPlugin('videoNoMercyConnect', videoNoMercyConnectPlugin);
		player.value?.usePlugin('videoNoMercyConnect');
	}

	const desktopUIPlugin = new DesktopUIPlugin();
	player.value?.registerPlugin('desktopUI', desktopUIPlugin);
	player.value?.usePlugin('desktopUI');

	const autoSkipPlugin = new AutoSkipPlugin();
	player.value?.registerPlugin('autoSkip', autoSkipPlugin);
	player.value?.usePlugin('autoSkip');

	const keyHandlerPlugin = new KeyHandlerPlugin();
	player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
	player.value?.usePlugin('keyHandler');

	if (!false) {
		const syncPlugin = new SyncPlugin();
		player.value?.registerPlugin('sync', syncPlugin);
		player.value?.usePlugin('sync');
	}

	const octopusPlugin = new OctopusPlugin();
	player.value?.registerPlugin('octopus', octopusPlugin);
	player.value?.usePlugin('octopus');

	// const sabrePlugin = new SabrePlugin();
	// player.value?.registerPlugin('sabre', sabrePlugin);
	// player.value?.usePlugin('sabre');

	player.value?.once('play', () => {
		player.value?.enterFullscreen();
	});

	player.value?.on('playlistComplete', () => {
		player.value?.dispose();
		router.back();
	});

	player.value?.once('back', () => {});

	player.value?.on('play', () => {
		setDisableScreensaver(true);
	});

	player.value?.on('pause', () => {
		setDisableScreensaver(false);
	});

	player.value?.on('fullscreen', (value) => {
		// @ts-ignore
		window.external?.sendMessage?.(
			value ? 'enterFullscreen' : 'exitFullscreen',
		);
	});
}

watch(data, (value) => {
	initPlayer(value);
});

onMounted(() => {
	audioPlayer.stop();
	if (false) {
		initPlayer();
	}
	else {
		initPlayer(data.value);
	}
});

onUnmounted(() => {
	player.value?.dispose();
	setDisableScreensaver(false);
});
</script>

<template>
	<IonPage>
		<div id="player1" class="group nomercyplayer" />
	</IonPage>
</template>

<style>
.nomercyplayer dialog {
	background: #000000cc;
}
</style>
