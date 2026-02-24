<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import type { ResolvedTrailer } from '@/types/api/trailerService';

import type { NMPlayer, PlayerConfig, PlaylistItem } from '@/lib/VideoPlayer';
import { AutoSkipPlugin, DesktopUIPlugin, KeyHandlerPlugin, nmplayer } from '@/lib/VideoPlayer';

import { closeSidebar, setSidebar, sidebar } from '@/store/sidebar';
import { setDisableScreensaver } from '@/store/imageModal';
import { musicVisibility } from '@/store/audioPlayer';
import audioPlayer from '@/store/audioPlayer.ts';

const props = defineProps({
	resolvedTrailer: {
		type: Object as PropType<ResolvedTrailer>,
		required: true,
	},
	toggle: {
		type: Function as PropType<() => void>,
		required: true,
	},
});

const sidebarState = ref();
const trailer = ref<NMPlayer<PlaylistItem>>();

function initPlayer(resolved: ResolvedTrailer) {
	const playlistItem: PlaylistItem = {
		id: resolved.videoId,
		file: resolved.videoUrl,
		image: resolved.thumbnailUrl,
		title: resolved.title,
		duration: '',
		description: '',
		tracks: resolved.subtitles,
		withCredentials: false,
	};

	const config: Partial<PlayerConfig<PlaylistItem>> = {
		muted: false,
		controls: false,
		preload: 'auto',
		debug: false,
		autoPlay: true,
		playlist: [playlistItem],
		controlsTimeout: 3000,
		doubleClickDelay: 300,
		playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
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

	trailer.value?.once('playing', () => {
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

onMounted(() => {
	audioPlayer.stop();
	sidebarState.value = sidebar.value;

	setDisableScreensaver(true);
	closeSidebar();

	initPlayer(props.resolvedTrailer);
});

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
			class="absolute inset-0 w-full h-auto max-w-full max-h-full sm:w-full sm:h-auto sm:overflow-hidden sm:inset-1/2 sm:aspect-video sm:-translate-y-[50%] px-4 py-2 xl:px-[1.8rem] sidebar-closed:xl:py-4 sm:-translate-x-[50%] sidebar-open:px-4 sidebar-open:py-6 sidebar-open:xl:px-[2.8rem] sidebar-open:xl:py-6"
		>
			<div
				class="relative rounded-2xl flex overflow-clip mx-auto children:overflow-clip h-auto top-1/4 sm:top-1/2 sm:-translate-y-1/2 w-auto sm:w-fit max-w-available sm:h-full"
				@click.stop=""
			>
				<div id="trailer" class="group nomercyplayer" />
			</div>
		</div>
	</button>
</template>

<style scoped></style>
