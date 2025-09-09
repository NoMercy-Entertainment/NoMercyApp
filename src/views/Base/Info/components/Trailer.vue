<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { PropType } from 'vue';

import type { InfoResponse } from '@/types/api/base/info';

import type {
	NMPlayer,
	NMPlaylistItem,
	PlayerConfig,
	PlaylistItem,
} from '@/lib/VideoPlayer';
import {
	AutoSkipPlugin,
	DesktopUIPlugin,
	KeyHandlerPlugin,
	nmplayer,
} from '@/lib/VideoPlayer';

import { closeSidebar, setSidebar, sidebar } from '@/store/sidebar';
import { setDisableScreensaver } from '@/store/imageModal';
import { musicVisibility } from '@/store/audioPlayer';
import useServerClient from '@/lib/clients/useServerClient.ts';
import { user } from '@/store/user.ts';
import { currentServer } from '@/store/currentServer.ts';
import audioPlayer from '@/store/audioPlayer.ts';
import { useRoute } from 'vue-router';

const props = defineProps({
	videos: {
		type: Array as PropType<InfoResponse['videos']>,
		required: true,
	},
	toggle: {
		type: Function as PropType<() => void>,
		required: true,
	},
	open: {
		type: Boolean,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
	incrementTrailerIndex: {
		type: Function as PropType<() => void>,
		required: true,
	},
});

const route = useRoute();

const { data, isError } = useServerClient<NMPlaylistItem>({
	queryKey: ['base', 'info', route.params.id, 'trailer', props.videos[props.index].src],
	path: `trailer/${props.videos[props.index].src}`,
});

const trailerContainer = ref<HTMLElement>();
const sidebarState = ref();
const trailer = ref<NMPlayer<PlaylistItem>>();

function initPlayer(value: NMPlaylistItem) {
	const config: Partial<PlayerConfig<PlaylistItem>> = {
		muted: false,
		controls: false,
		preload: 'auto',
		debug: false,
		autoPlay: true,
		playlist: [value],
		controlsTimeout: 3000,
		doubleClickDelay: 300,
		playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
		accessToken: user.value?.accessToken,
		basePath: currentServer.value?.serverBaseUrl,
	} satisfies PlayerConfig<PlaylistItem>;

	// @ts-ignore
	trailer.value = nmplayer('trailer').setup(config);

	trailer.value?.once('back', () => {
		props.toggle();
	});

	const desktopUIPlugin = new DesktopUIPlugin();
	trailer.value?.registerPlugin('desktopUI', desktopUIPlugin);
	trailer.value?.usePlugin('desktopUI');

	const autoSkipPlugin = new AutoSkipPlugin();
	trailer.value?.registerPlugin('autoSkip', autoSkipPlugin);
	trailer.value?.usePlugin('autoSkip');

	const keyHandlerPlugin = new KeyHandlerPlugin();
	trailer.value?.registerPlugin('keyHandler', keyHandlerPlugin);
	trailer.value?.usePlugin('keyHandler');

	trailer.value?.on('playlistComplete', () => {
		console.log('Playlist complete');
		props.toggle();
	});

	trailer.value?.on('play', () => {
		setDisableScreensaver(true);
	});

	trailer.value?.on('pause', () => {
		setDisableScreensaver(false);
	});

	trailer.value?.on('fullscreen', (value) => {
		// @ts-ignore
		window.external?.sendMessage?.(
			value ? 'enterFullscreen' : 'exitFullscreen',
		);
	});
	trailer.value?.on('remove', () => {
		props.toggle();
		props.incrementTrailerIndex();
	});
	trailer.value?.on('error', () => {
		props.toggle();
	});
	trailer.value?.on('close', () => {
		props.toggle();
	});

	trailer.value?.on('captionsChanged', (item: any) => {
		if (item.track === -1) {
			localStorage.setItem('trailerSubtitles', 'off');
		}
		else {
			localStorage.setItem('trailerSubtitles', item.track);
		}
	});

	trailer.value?.once('ready', () => {
		trailer.value?.seek(0);
	});

	trailer.value?.on('play', () => {
		if (localStorage.getItem('trailerSubtitles') === 'off') {
			trailer.value?.setCurrentCaption(-1);
		}
		else {
			trailer.value?.setCurrentCaption(
				Number.parseInt(localStorage.getItem('trailerSubtitles') ?? '-1', 10),
			);
		}
	});
}

watch(data, (value) => {
	if (!value || isError.value)
		return;
	initPlayer(value);
});

onMounted(() => {
	if (!data.value || isError.value)
		return;

	audioPlayer.stop();
	sidebarState.value = sidebar.value;

	setDisableScreensaver(true);
	closeSidebar();

	initPlayer(data.value);
});

// const trailer = ref<NMPlayer<NMPlaylistItem>>();
//
// onMounted(() => {
// 	sidebarState.value = sidebar.value;
//
// 	closeSidebar();
//
// 	setDisableScreensaver(true);
//
// 	if (!props.videos[props.index]?.src)
// 		return;
//
// 	const config: PlayerConfig = {
// 		muted: false,
// 		controls: false,
// 		autoPlay: true,
// 		chapters: false,
// 		preload: 'auto',
// 		playlist: [
// 			{
// 				id: props.videos[props.index].src,
// 				image: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${
// 					props.videos[props.index].src
// 				}.jpg`,
// 				file: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${
// 					props.videos[props.index].src
// 				}.webm`,
// 				title: `${
// 					props.videos[props.index].name
// 						.toLocaleLowerCase()
// 						.includes(props.title.toLocaleLowerCase())
// 						? ''
// 						: `${props.title} - `
// 				}${props.videos[props.index].name}`.toTitleCase(),
// 				duration: '',
// 				description: '',
// 				tracks: [
// 					{
// 						id: 1,
// 						label: 'full',
// 						file: `https://trailer.nomercy.tv/${
// 							props.videos[props.index].src
// 						}/${props.videos[props.index].src}.en.vtt`,
// 						language: 'eng',
// 						kind: 'subtitles',
// 					},
// 				],
// 			},
// 		],
// 		playbackRates: [],
// 	};
//
// 	// @ts-ignore
// 	trailer.value = nmplayer('trailer').setup(config);
//
// 	trailer.value?.once('back', () => {
// 		props.toggle();
// 	});
//
// 	const desktopUIPlugin = new DesktopUIPlugin();
// 	trailer.value?.registerPlugin('desktopUI', desktopUIPlugin);
// 	trailer.value?.usePlugin('desktopUI');
//
// 	const keyHandlerPlugin = new KeyHandlerPlugin();
// 	trailer.value?.registerPlugin('keyHandler', keyHandlerPlugin);
// 	trailer.value?.usePlugin('keyHandler');
//
// 	// @ts-ignore
// 	window.trailer = toRaw(trailer.value);
//
// 	trailer.value?.once('ready', () => {
// 		if (isNative.value) {
// 			trailer.value?.enterFullscreen();
// 		}
// 	});
//
// 	trailer.value?.on('ended', () => {
// 		setSidebar(sidebarState.value);
// 		props.toggle();
// 	});
// 	trailer.value?.on('remove', () => {
// 		props.toggle();
// 		props.incrementTrailerIndex();
// 	});
// 	trailer.value?.on('error', () => {
// 		props.toggle();
// 	});
// 	trailer.value?.on('close', () => {
// 		props.toggle();
// 	});
//
// 	trailer.value?.on('captionsChanged', (item: any) => {
// 		if (item.track === -1) {
// 			localStorage.setItem('trailerSubtitles', 'off');
// 		}
// 		else {
// 			localStorage.setItem('trailerSubtitles', item.track);
// 		}
// 	});
//
// 	trailer.value?.on('play', () => {
// 		if (localStorage.getItem('trailerSubtitles') === 'off') {
// 			trailer.value?.setCurrentCaption(-1);
// 		}
// 		else {
// 			trailer.value?.setCurrentCaption(
// 				Number.parseInt(localStorage.getItem('trailerSubtitles') ?? '-1', 10),
// 			);
// 		}
// 	});
//
// 	App.addListener('backButton', props.toggle);
// });

onUnmounted(() => {
	setSidebar(sidebarState.value ?? 'open');
	setDisableScreensaver(false);

	if (trailer.value) {
		try {
			trailer.value?.dispose();
		}
		catch {
			//
		}
	}
});
</script>

<template>
	<button
		class="fixed inset-0 h-available w-available overflow-hidden rounded-lg bg-black/50"
		@click="toggle()"
	>
		<div
			:data-music="musicVisibility"
			:data-sidebar="sidebar"
			class="absolute inset-0 w-full h-auto max-w-full max-h-full sm:w-full sm:h-auto sm:overflow-hidden sm:inset-1/2 sm:aspect-video sm:-translate-y-[50%] sidebar-closed:px-4 sidebar-closed:py-2 sidebar-closed:xl:px-[1.8rem] sidebar-closed:xl:py-4 sm:-translate-x-[50%] sidebar-open:px-4 sidebar-open:py-6 sidebar-open:xl:px-[2.8rem] sidebar-open:xl:py-6"
		>
			<div
				ref="trailerContainer"
				class="relative rounded-2xl flex overflow-clip mx-auto children:overflow-clip h-auto top-1/4 sm:top-1/2 -translate-y-1/2 w-fit sm:h-full"
				@click.stop=""
			>
				<div id="trailer" class="group nomercyplayer" />
			</div>
		</div>
	</button>
</template>

<style scoped></style>
