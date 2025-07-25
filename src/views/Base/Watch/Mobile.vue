<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage, isPlatform } from '@ionic/vue';
import { App } from '@capacitor/app';

import {
	disableImmersiveMode,
	enableImmersiveMode,
	lockLandscape,
	lockPortrait,
} from '@/lib/utils';
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
	DesktopUIPlugin,
	nmplayer,
	OctopusPlugin,
	SyncPlugin,
} from '@/lib/VideoPlayer';

import audioPlayer from '@/store/audioPlayer';
import router from '@/router';
import { VideoNoMercyConnectPlugin } from '@/lib/VideoPlayer/plugins/videoNoMercyConnectPlugin.ts';
import useServerClient from '@/lib/clients/useServerClient.ts';

const { data } = useServerClient<NMPlaylistItem[]>({
	enabled: !user.value.features?.nomercyConnect,
});

const player = ref<NMPlayer<NMPlaylistItem>>();

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
		renderAhead: 100,
		disableAutoPlayback: user.value.features?.nomercyConnect,
	} satisfies PlayerConfig<PlaylistItem>;

	// @ts-ignore
	player.value = nmplayer('player1').setup(config);

	player.value?.once('back', () => {
		//
	});

	if (user.value.features?.nomercyConnect) {
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

	if (!user.value.features?.nomercyConnect) {
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

	player.value?.on('dispose', () => {
		lockPortrait();
		disableImmersiveMode();
		router.back();
	});

	player.value?.on('back', () => {
		player.value?.dispose();
	});

	player.value?.on('play', () => {
		setDisableScreensaver(true);
	});

	player.value?.on('pause', () => {
		setDisableScreensaver(false);
	});

	player.value?.on('ready', () => {
		lockLandscape();
		enableImmersiveMode();
		audioPlayer.stop();
	});

	player.value?.on('item', () => {
		player.value?.play();
	});

	App.addListener('backButton', () => {
		player.value?.emit('back-button-hyjack');
		router.back();
	});
}

watch(data, (value) => {
	initPlayer(value);
});

onMounted(() => {
	audioPlayer.stop();
	if (user.value.features?.nomercyConnect) {
		initPlayer();
	}
	else {
		initPlayer(data.value);
	}
});

onUnmounted(() => {
	setDisableScreensaver(false);
});

onBeforeUnmount(() => {
	player.value?.dispose();
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<Teleport to="body">
				<div
					class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199"
					:class="{
						'mb-28': isNative,
						'mb-0': !isNative,
					}"
				>
					<div id="player1" class="group nomercyplayer" />
				</div>
			</Teleport>
		</IonContent>
	</IonPage>
</template>

<style>
.nomercyplayer .top-bar {
	@apply pt-safe-offset-4;
}
.nomercyplayer dialog {
	background: #000000cc;
}
</style>
