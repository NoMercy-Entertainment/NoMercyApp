<script lang="ts" setup>
import { onMounted, onUnmounted, type PropType, ref, toRaw } from 'vue';

import type { InfoResponse } from '@/types/api/base/info';

import type { NMPlayer, NMPlaylistItem, PlayerConfig } from '@/lib/VideoPlayer';
import { DesktopUIPlugin, KeyHandlerPlugin, nmplayer } from '@/lib/VideoPlayer';
import { closeSidebar, setSidebar, sidebar } from '@/store/sidebar';
import { setDisableScreensaver } from '@/store/imageModal';
import { musicVisibility } from '@/store/audioPlayer';
import { App } from '@capacitor/app';
import { isNative } from '@/config/global';

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

const trailerContainer = ref<HTMLElement>();
const sidebarState = ref();

const trailer = ref<NMPlayer<NMPlaylistItem>>();

onMounted(() => {
	sidebarState.value = sidebar.value;

	closeSidebar();

	setDisableScreensaver(true);

	if (!props.videos[props.index]?.src)
		return;

	const config: PlayerConfig = {
		muted: false,
		controls: false,
		autoPlay: true,
		chapters: false,
		preload: 'auto',
		playlist: [
			{
				id: props.videos[props.index].src,
				image: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${
					props.videos[props.index].src
				}.jpg`,
				file: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${
					props.videos[props.index].src
				}.webm`,
				title: `${
					props.videos[props.index].name
						.toLocaleLowerCase()
						.includes(props.title.toLocaleLowerCase())
						? ''
						: `${props.title} - `
				}${props.videos[props.index].name}`.toTitleCase(),
				duration: '',
				description: '',
				tracks: [
					{
						id: 1,
						label: 'full',
						file: `https://trailer.nomercy.tv/${
							props.videos[props.index].src
						}/${props.videos[props.index].src}.en.vtt`,
						language: 'eng',
						kind: 'subtitles',
					},
				],
			},
		],
		playbackRates: [],
	};

	// @ts-ignore
	trailer.value = nmplayer('trailer').setup(config);

	trailer.value?.once('back', () => {
		props.toggle();
	});

	const desktopUIPlugin = new DesktopUIPlugin();
	trailer.value?.registerPlugin('desktopUI', desktopUIPlugin);
	trailer.value?.usePlugin('desktopUI');

	const keyHandlerPlugin = new KeyHandlerPlugin();
	trailer.value?.registerPlugin('keyHandler', keyHandlerPlugin);
	trailer.value?.usePlugin('keyHandler');

	// @ts-ignore
	window.trailer = toRaw(trailer.value);

	trailer.value?.once('ready', () => {
		if (isNative.value) {
			trailer.value?.enterFullscreen();
		}
	});

	trailer.value?.on('ended', () => {
		setSidebar(sidebarState.value);
		props.toggle();
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

	App.addListener('backButton', props.toggle);
});

onUnmounted(() => {
	setSidebar(sidebarState.value);
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
		class="fixed h-full w-full overflow-hidden rounded-lg bg-black/50"
		@click="toggle($event)"
	>
		<div
			:data-music="musicVisibility"
			:data-sidebar="sidebar"
			class="absolute w-screen h-available sm:w-auto sm:overflow-hidden sm:inset-1/2 sm:aspect-video sm:-translate-y-[50%] sidebar-closed:sm:h-full sidebar-closed:sm:max-w-[90vw] sidebar-closed:sm:max-h-[93%] sidebar-closed:px-4 sidebar-closed:py-2 sidebar-closed:xl:px-[1.8rem] sidebar-closed:xl:py-4 sm:-translate-x-[50%] sidebar-open:h-5/6 sidebar-open:px-10 sidebar-open:py-6 sidebar-open:xl:px-[2.8rem] sidebar-open:xl:py-6"
		>
			<div
				ref="trailerContainer"
				class="relative rounded-2xl flex overflow-clip children:overflow-clip h-auto top-1/2 -translate-y-1/2 w-full sm:h-full children:!w-full children:!h-auto children:!aspect-video"
			>
				<div id="trailer" class="group nomercyplayer" />
			</div>
		</div>
	</button>
</template>

<style scoped></style>
