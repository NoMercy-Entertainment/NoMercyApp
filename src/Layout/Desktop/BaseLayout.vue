<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonRouterOutlet, IonTabs } from '@ionic/vue';

import { background } from '@/store/ui';
import { currentServer } from '@/store/currentServer';

import Indexer from '@/Layout/Indexer.vue';
// import Screensaver from '@/Layout/Screensaver.vue';
import Navbar from './components/Navbar/Navbar.vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import GradientBorder from './components/GradientBorder.vue';
import QueueOverlay from './components/Overlays/QueueOverlay.vue';
import LyricsOverlay from './components/Overlays/LyricsOverlay.vue';
import DeviceOverlay from './components/Overlays/DeviceOverlay.vue';
import RipperOverlay from './components/Overlays/RipperOverlay.vue';

import { AsyncMusicPlayerDesktop } from '@/components/async';
import EqualizerOverlay from '@/Layout/Desktop/components/Overlays/EqualizerOverlay.vue';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';
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
				<Sidebar v-if="!!currentServer" />

				<GradientBorder :hide-border="false">
					<main
						id="mainContent"
						:style="backgroundUrl && !backgroundUrl.includes('null') ? `background-image: url(${backgroundUrl})` : ''"
						class="flex w-px flex-1 flex-col relative overflow-clip justify-start items-start w-available h-available sm:rounded-2xl border-surface-2 !bg-cover children:scrollbar-none z-0 bg-center sm:border-3 before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:w-full before:h-full before:bg-surface-12/9 dark:before:bg-surface-1/9"
						style="box-shadow: 0 1px 3px 0 rgba(16,24,40,0.1), 0 1px 2px 0 rgba(16,24,40,0.06);"
					>
						<Shadow />
						<slot v-if="$slots.default" />
						<IonTabs v-else>
							<IonRouterOutlet :key="route.fullPath" :animated="false" />
						</IonTabs>
					</main>

					<div id="slide-container" class="contents" />

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

			<AsyncMusicPlayerDesktop />
		</div>
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
