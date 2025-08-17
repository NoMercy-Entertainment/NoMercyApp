<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonRouterOutlet, IonTabs } from '@ionic/vue';

import ContextMenu from 'primevue/contextmenu';
import ConfirmDialog from 'primevue/confirmdialog';

import type { MenuItem } from 'primevue/menuitem';

import { background } from '@/store/ui';
import { currentServer } from '@/store/currentServer';
import { contextMenu, contextMenuItems } from '@/store/contextMenuItems';
import { cardMenu, trackContextMenuItems } from '@/store/contextMenuItems';

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
import { isDarkMode } from '@/config/global.ts';
import Shadow from '@/Layout/Desktop/components/Shadow.vue';

const route = useRoute();

const backgroundUrl = computed(() => {
	if (!background.value)
		return null;
	return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

function focusMain() {
	document.querySelector<HTMLButtonElement>('main a, main button')?.focus();
}
</script>

<template>
	<IonPage>
		<button
			:onclick="focusMain"
			class="skip-navigation absolute z-999 top-[-50px] left-2 bg-slate-light-1 dark:bg-slate-dark-1 text-white p-2 rounded-md"
		>
			{{ $t("Skip navigation") }}
		</button>
		<div class="contents text-auto-12">
			<Navbar />
			<div
				class="bg-slate-light-1 dark:bg-slate-dark-1 relative z-0 flex h-px flex-1 flex-grow items-start justify-start self-stretch overflow-clip w-available h-available scrollbar-none group"
			>
				<ChristmasSnow />
				<Sidebar />

				<GradientBorder :hide-border="false">
					<div
						id="mainContent"
						class="flex w-px flex-1 flex-col relative overflow-clip justify-start items-start w-available h-available sm:rounded-2xl border-auto-alpha-2 !bg-cover children:scrollbar-none z-0 bg-center"
						:style="`
                  box-shadow: 0 1px 3px 0 rgba(16,24,40,0.1), 0 1px 2px 0 rgba(16,24,40,0.06);
                  background-image: ${
							backgroundUrl && !backgroundUrl.includes('null')
								? `url(${backgroundUrl})`
								: ''
						};
               `"
					>
						<div
							id="overlay"
							class="pointer-events-none absolute inset-0 dark:flex w-full h-full"
							:style="`
                 background: ${
								!background
									? ''
									: isDarkMode
										? 'rgba(0, 0, 0, 0.7)'
										: 'rgba(0, 0, 0, 0.4)'
							};
               `"
						/>
						<div
							class="flex flex-col relative overflow-auto justify-start items-start w-available h-available sm:rounded-2xl flex-1 border-auto-alpha-2 !bg-cover children:scrollbar-none sm:border-3"
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
									<IonRouterOutlet
										:key="route.path"
										animated="false"
									/>
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
			<ImageModal />
			<ConfirmDialog />
			<ContextMenu ref="contextMenu" :model="contextMenuItems" />
		</div>
		<ContextMenu ref="cardMenu" :model="trackContextMenuItems as MenuItem[]" />
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
