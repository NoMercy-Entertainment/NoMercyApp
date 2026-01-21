<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IonPage, IonRouterOutlet, IonTabs } from '@ionic/vue';
import { useRoute } from 'vue-router';

import ContextMenu from 'primevue/contextmenu';
import ConfirmDialog from 'primevue/confirmdialog';

import type { MenuItem } from 'primevue/menuitem';

import { background } from '@/store/ui';
import { currentServer } from '@/store/currentServer';
import { cardMenu, contextMenu, contextMenuItems, trackContextMenuItems } from '@/store/contextMenuItems';

import Indexer from '@/Layout/Indexer.vue';
import ImageModal from '@/Layout/ImageModal.vue';
// import Screensaver from '@/Layout/Screensaver.vue';
import Navbar from './components/Navbar/Navbar.vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import GradientBorder from './components/GradientBorder.vue';
import QueueOverlay from './components/Overlays/QueueOverlay.vue';
import LyricsOverlay from './components/Overlays/LyricsOverlay.vue';
import DeviceOverlay from './components/Overlays/DeviceOverlay.vue';
import RipperOverlay from './components/Overlays/RipperOverlay.vue';

import MusicPlayerDesktop from '@/components/MusicPlayer/MusicPlayerDesktop.vue';
import EqualizerOverlay from '@/Layout/Desktop/components/Overlays/EqualizerOverlay.vue';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';
import Shadow from '@/Layout/Desktop/components/Shadow.vue';
import { useEventListener } from '@vueuse/core';
import type { PlaylistItem } from '@/types/musicPlayer.ts';
import CreatePlaylistModal from '@/Layout/Desktop/components/Menus/CreatePlaylistModal.vue';

const route = useRoute();

const backgroundUrl = computed(() => {
	if (!background.value)
		return null;
	return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

function focusMain() {
	document.querySelector<HTMLButtonElement>('main a, main button')?.focus();
}

interface ModalEvent {
	detail: {
		modalName: string;
		modalProps: unknown;
	};
}

const playlistModalData = ref<PlaylistItem | null>(null);

function handleModalTrigger(modalName: string, modalProps: unknown) {
	if (modalName === 'createPlaylist') {
		const playlist = modalProps as unknown as PlaylistItem;
		console.log(playlist);
		playlistModalData.value = playlist;
	}
}

function onClose() {
	playlistModalData.value = null;
}

useEventListener(document, 'showModal', (evt) => {
	const event = evt as unknown as ModalEvent;
	handleModalTrigger(event.detail.modalName, event.detail.modalProps);
});
</script>

<template>
	<IonPage>
		<button
			:onclick="focusMain"
			class="skip-navigation absolute z-999 top-[-50px] left-2 bg-surface-1 p-2 rounded-md text-slate-11"
		>
			{{ $t("Skip navigation") }}
		</button>
		<div class="contents">
			<Navbar />
			<div
				class="relative z-0 flex h-px flex-1 flex-grow items-start justify-start self-stretch overflow-clip w-available h-available scrollbar-none group"
			>
				<ChristmasSnow />
				<Sidebar />

				<GradientBorder :hide-border="false">
					<div
						id="mainContent"
						:style="`
                  background-image: ${
							backgroundUrl && !backgroundUrl.includes('null')
								? `url(${backgroundUrl})`
								: ''
						};
               `"
						class="flex w-px flex-1 flex-col relative overflow-clip justify-start items-start w-available h-available sm:rounded-2xl border-surface-2 !bg-cover children:scrollbar-none z-0 bg-center"
						style="box-shadow: 0 1px 3px 0 rgba(16,24,40,0.1), 0 1px 2px 0 rgba(16,24,40,0.06);"
					>
						<div
							id="overlay"
							class="pointer-events-none absolute inset-0 dark:flex w-full h-full bg-surface-12/9 dark:bg-surface-1/9"
						/>
						<div
							class="flex flex-col relative overflow-clip justify-start items-start w-available h-available sm:rounded-2xl flex-1 border-surface-2 !bg-cover children:scrollbar-none sm:border-3"
						>
							<Shadow />
							<main
								id="main"
								class="flex h-auto flex-1 flex-grow flex-col items-start justify-start self-stretch bg-cover bg-center bg-no-repeat min-h-available w-available scrollbar-none sm:child:border-2 sm:rounded-2xl"
								style="
                  box-shadow: 0 1px 3px 0 rgba(16, 24, 40, 0.1),
                    0 1px 2px 0 rgba(16, 24, 40, 0.06);
                "
							>
								<slot v-if="$slots.default" />
								<IonTabs v-else>
									<IonRouterOutlet :key="route.name" :animated="false" />
								</IonTabs>
							</main>
						</div>
						<div id="slide-container" class="contents" />
					</div>

					<LyricsOverlay
						class="hidden sm:block bg-focus [transform:translateZ(0)]"
					/>
					<QueueOverlay />
					<DeviceOverlay />
					<EqualizerOverlay />
					<RipperOverlay
						v-if="currentServer?.is_owner || currentServer?.is_manager"
					/>
				</GradientBorder>
				<Indexer />
				<div class="scrollbarContainer">
					<!-- the ScrollContainer teleports here -->
				</div>
			</div>

			<MusicPlayerDesktop />
			<Suspense>
				<ImageModal />
			</Suspense>
			<ConfirmDialog />
			<ContextMenu ref="contextMenu" :model="contextMenuItems" />
		</div>

		<ContextMenu ref="cardMenu" :model="trackContextMenuItems as MenuItem[]" />

		<CreatePlaylistModal v-if="playlistModalData" :data="playlistModalData" :on-close="onClose" />
	</IonPage>
</template>

<style scoped>
.skip-navigation {
	text-decoration: none;
	transition: top 0.3s;
}

.skip-navigation:focus {
	top: 0.5rem;
}
</style>
