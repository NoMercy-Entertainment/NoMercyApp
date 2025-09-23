<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { isNative } from '@/config/global';
import { setDisableScreensaver } from '@/store/imageModal';
import {
	DesktopUIPlugin,
	KeyHandlerPlugin,
	nmplayer,

} from '@/lib/VideoPlayer';
import type { NMPlayer, PlayerConfig } from '@/lib/VideoPlayer';
import {
	discContents,
	ripperPlaylist,
	ripperPlaylistLoading,
} from '@/store/ripper';
import { user } from '@/store/user';
import { currentServer } from '@/store/currentServer';
import { ripperSocketIsConnected } from '@/lib/clients/ripperSocket';

const player = ref<NMPlayer>();
const playerContainer = ref<HTMLDivElement>();

onMounted(() => {
	player.value?.dispose();
});

onUnmounted(() => {
	player.value?.dispose();
	setDisableScreensaver(false);
});

watch(ripperPlaylist, (value) => {
	if (value) {
		player.value?.dispose();

		ripperPlaylistLoading.value = false;

		const config: PlayerConfig = {
			muted: false,
			controls: false,
			preload: 'auto',
			debug: false,
			autoPlay: true,
			controlsTimeout: 3000,
			doubleClickDelay: 300,
			playlist: [
				{
					file: '/transcode/ripper/master.m3u8',
					title: value.playlist_id,
					id: value.playlist_id,
					image: discContents.value?.metadata.data.TvShow?.backdrop_path
						? `https://app.nomercy.tv/tmdb-images${
							discContents.value?.metadata.data.TvShow?.backdrop_path}`
						: '',
					description: discContents.value?.metadata.data.TvShow?.overview
						? `https://app.nomercy.tv/tmdb-images${
							discContents.value?.metadata.data.TvShow?.overview}`
						: '',
					duration: value.duration,
				},
			],
			playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
			accessToken: user.value?.accessToken,
			basePath: currentServer.value?.serverBaseUrl,
			renderAhead: 100,
			customStorage: {
				set: (key, value) => {
					return new Promise<void>((resolve) => {
						localStorage.setItem(key, value);
						resolve();
					});
				},
				get: (key) => {
					return new Promise<string | null>((resolve) => {
						resolve(localStorage.getItem(key));
					});
				},
				remove: (key) => {
					return new Promise<void>((resolve) => {
						localStorage.removeItem(key);
						resolve();
					});
				},
			},
		};

		// @ts-ignore
		player.value = nmplayer('player1').setup(config);

		const desktopUIPlugin = new DesktopUIPlugin();
		player.value?.registerPlugin('desktopUI', desktopUIPlugin);
		player.value?.usePlugin('desktopUI');

		const keyHandlerPlugin = new KeyHandlerPlugin();
		player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
		player.value?.usePlugin('keyHandler');
	}
	else {
		player.value?.dispose();
	}
});

watch(ripperSocketIsConnected, async (value) => {
	if (value) {
		//
	}
	else {
		player.value?.dispose();
	}
});
</script>

<template>
	<div
		ref="playerContainer"
		:class="{
			'mb-28': isNative,
			'mb-0': !isNative,
		}"
		class="absolute inset-0 flex h-full w-full overflow-clip bg-black"
	>
		<div id="player1" class="group nomercyplayer" />

		<div
			v-if="ripperPlaylistLoading"
			class="p-4 h-available w-full overflow-auto absolute inset-0 z-10"
		>
			<div class="flex flex-col gap-4 items-center justify-center h-full pt-8">
				<svg
					aria-hidden="true"
					class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-focus"
					fill="none"
					viewBox="0 0 100 101"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span>
					{{ $t("Encoding preview video") }}
				</span>
			</div>
		</div>
	</div>
</template>

<!-- <style > -->
<!--  video { -->
<!--    &#45;&#45;tw-blur: blur(12px); -->
<!--    filter: var(&#45;&#45;tw-blur) var(&#45;&#45;tw-brightness) var(&#45;&#45;tw-contrast) var(&#45;&#45;tw-grayscale) var(&#45;&#45;tw-hue-rotate) var(&#45;&#45;tw-invert) var(&#45;&#45;tw-saturate) var(&#45;&#45;tw-sepia) var(&#45;&#45;tw-drop-shadow); -->
<!--  } -->
<!-- </style> -->
