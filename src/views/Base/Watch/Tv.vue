<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage, isPlatform } from '@ionic/vue';
import { App } from '@capacitor/app';

import { isNative } from '@/config/global';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { setDisableScreensaver } from '@/store/imageModal';

import type {
	NMPlayer,
	NMPlaylistItem,
	PlayerConfig,
	PlaylistItem,
} from '@/lib/VideoPlayer';
import {
	AutoSkipPlugin,
	nmplayer,
	OctopusPlugin,
	SyncPlugin,
	TVUIPlugin,
} from '@/lib/VideoPlayer';

import audioPlayer from '@/store/audioPlayer';
import router from '@/router';
import { hideNavBar, showNavBar } from '@/store/ui';
import useServerClient from '@/lib/clients/useServerClient';
// import { VideoNoMercyConnectPlugin } from '@/lib/VideoPlayer/plugins/videoNoMercyConnectPlugin.ts';
import KeyHandlerPlugin from '@/lib/VideoPlayer/plugins/keyHandlerPlugin.ts';

const { data } = useServerClient<NMPlaylistItem[]>({
	// enabled: !user.value.features?.nomercyConnect,
});

const player = ref<NMPlayer<NMPlaylistItem>>();

function goBack() {
	player.value?.emit('back-button');
	player.value?.emit('back-button-hyjack');
}

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
		accessToken:
      user.value?.accessToken || localStorage.getItem('access_token') || '',
		basePath: currentServer.value?.serverBaseUrl,
		forceTvMode:
      (isPlatform('android') || isPlatform('ios')) && !isPlatform('mobile'),
		disableTouchControls: false,
		disableMediaControls:
      'mediaSession' in navigator || isPlatform('capacitor'),
		renderAhead: 10,
		// disableAutoPlayback: user.value.features?.nomercyConnect,
	};

	// @ts-ignore
	player.value = nmplayer('player1').setup(config);

	// if (user.value.features?.nomercyConnect) {
	// 	const videoNoMercyConnectPlugin = new VideoNoMercyConnectPlugin();
	// 	player.value?.registerPlugin('videoNoMercyConnect', videoNoMercyConnectPlugin);
	// 	player.value?.usePlugin('videoNoMercyConnect');
	// }

	const tvUIPlugin = new TVUIPlugin();
	player.value?.registerPlugin('tvUI', tvUIPlugin);
	player.value?.usePlugin('tvUI');

	const autoSkipPlugin = new AutoSkipPlugin();
	player.value?.registerPlugin('autoSkip', autoSkipPlugin);
	player.value?.usePlugin('autoSkip');

	const keyHandlerPlugin = new KeyHandlerPlugin();
	player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
	player.value?.usePlugin('keyHandler');

	// if (!user.value.features?.nomercyConnect) {
	const syncPlugin = new SyncPlugin();
	player.value?.registerPlugin('sync', syncPlugin);
	player.value?.usePlugin('sync');
	// }

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

	player.value?.on('error', (e) => {
		console.error(e);
	});

	player.value?.on('back', () => {
		router.back();
	});

	player.value?.on('play', () => {
		setDisableScreensaver(true);
	});

	player.value?.on('pause', () => {
		setDisableScreensaver(false);
	});

	player.value?.on('ready', () => {
		hideNavBar();
		audioPlayer.stop();
	});

	player.value?.on('item', () => {
		player.value?.play();
	});

	App.addListener('backButton', goBack);
}

watch(data, (value) => {
	if (!value || !value.length)
		return;
	initPlayer(value);
});

onMounted(() => {
	audioPlayer.stop();
	if (user.value.features?.nomercyConnect) {
		initPlayer();
	}
});

onUnmounted(() => {
	setDisableScreensaver(false);
	showNavBar();
	player.value?.dispose();
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199"
				:class="{
					'mb-28': isNative,
					'mb-0': !isNative,
				}"
			>
				<div id="player1" class="group nomercyplayer" />
			</div>
		</IonContent>
	</IonPage>
</template>

<style>
.nomercyplayer .top-bar {
	padding-top: calc(var(--safe-area-inset-top, 0px) + 1rem);
}
.nomercyplayer dialog {
	background: #000000cc;
}
.nomercyplayer #slider-bar {
	background: #ffffff50;
}
</style>
