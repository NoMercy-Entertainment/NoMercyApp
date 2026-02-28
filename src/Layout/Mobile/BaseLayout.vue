<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useIsFetching } from '@tanstack/vue-query';
import { useEventListener } from '@vueuse/core';

import { lockPortrait, unlockOrientation } from '@/lib/utils/dom';
import { closeMenu } from '@/store/profileMenu';
import { currentSong, fullPlayerModalOpen } from '@/store/audioPlayer';
import { isPlatform } from '@ionic/vue';

import ImageModal from '@/Layout/ImageModal.vue';
import Screensaver from '@/Layout/Screensaver.vue';
import DeviceOverlay from '@/Layout/Desktop/components/Overlays/DeviceOverlay.vue';

import { AsyncMusicPlayerFull, AsyncMusicPlayerMini } from '@/components/async';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';

import ProfileMenu from './components/menus/ProfileMenu.vue';
import BottomBar from './components/BottomBar.vue';
import MobileLibraryHeader from '@/views/Base/Library/components/MobileLibraryHeader.vue';

import { OpenInAppBanner, WelcomeAppModal } from '@/components/AndroidApp';
import OfflineBanner from '@/components/OfflineBanner.vue';
import Indexer from '@/Layout/Indexer.vue';

const route = useRoute();
const isFetching = useIsFetching();

const isLandscape = ref(window.innerWidth > window.innerHeight);
const showRotateOverlay = computed(() => !isPlatform('capacitor') && isLandscape.value);

useEventListener(window, 'resize', () => {
	isLandscape.value = window.innerWidth > window.innerHeight;
});

onMounted(() => {
	lockPortrait();
	router.beforeEach(() => {
		closeMenu();
	});
});

onUnmounted(() => {
	unlockOrientation();
});
</script>

<template>
	<div id="main-content" class="flex flex-col h-dvh w-full overflow-hidden">
		<OfflineBanner />
		<div
			v-if="isFetching > 0"
			class="absolute top-0 z-1199 h-1 w-full bg-focus animate-pulse"
		/>
		<ChristmasSnow />
		<MobileLibraryHeader />

		<div class="flex-1 min-h-0 relative overflow-hidden flex flex-row">
			<RouterView :key="route.fullPath" />
			<Indexer />
		</div>

		<ProfileMenu />
		<DeviceOverlay class="!z-10" />

		<AsyncMusicPlayerMini
			:key="!fullPlayerModalOpen ? 'mini-player-open' : 'mini-player-closed'"
		/>

		<BottomBar />

		<AsyncMusicPlayerFull
			v-if="currentSong?.id"
			:key="fullPlayerModalOpen ? 'full-player-open' : 'full-player-closed'"
		/>

		<Suspense>
			<ImageModal />
		</Suspense>

		<OpenInAppBanner />
		<WelcomeAppModal />
		<Screensaver />

		<Transition name="fade">
			<div
				v-if="showRotateOverlay"
				class="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6 bg-black text-white select-none"
			>
				<svg class="w-16 h-16 animate-[spin_2s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
				</svg>
				<p class="text-lg font-semibold">{{ $t('Please rotate your device') }}</p>
				<p class="text-sm text-white/60">{{ $t('This app is designed for portrait mode') }}</p>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
