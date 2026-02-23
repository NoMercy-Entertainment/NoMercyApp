<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import router from '@/router';
import { useIsFetching } from '@tanstack/vue-query';

import { lockPortrait, unlockOrientation } from '@/lib/utils/dom';
import { closeMenu } from '@/store/profileMenu';
import { currentSong, fullPlayerModalOpen } from '@/store/audioPlayer';

import ImageModal from '@/Layout/ImageModal.vue';
// import Screensaver from '@/Layout/Screensaver.vue';
import DeviceOverlay from '@/Layout/Desktop/components/Overlays/DeviceOverlay.vue';

import { AsyncMusicPlayerFull, AsyncMusicPlayerMini } from '@/components/async';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';

import ProfileMenu from './components/menus/ProfileMenu.vue';
import BottomBar from './components/BottomBar.vue';
import MobileLibraryHeader from '@/views/Base/Library/components/MobileLibraryHeader.vue';

import { OpenInAppBanner, WelcomeAppModal } from '@/components/AndroidApp';
import OfflineBanner from '@/components/OfflineBanner.vue';

const isFetching = useIsFetching();

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
	<div id="main-content" class="contents">
		<OfflineBanner />
		<div
			v-if="isFetching > 0"
			class="absolute top-0 z-1199 h-1 w-full bg-focus animate-pulse"
		/>
		<ChristmasSnow />
		<MobileLibraryHeader />

		<RouterView />

		<ProfileMenu />
		<!--			<EqualizerMenu /> -->
		<DeviceOverlay class="!z-10" />

		<BottomBar />

		<AsyncMusicPlayerFull
			v-if="currentSong?.id"
			:key="fullPlayerModalOpen ? 'full-player-open' : 'full-player-closed'"
		/>
		<AsyncMusicPlayerMini
			:key="!fullPlayerModalOpen ? 'mini-player-open' : 'mini-player-closed'"
		/>
		<Suspense>
			<ImageModal />
		</Suspense>

		<OpenInAppBanner />
		<WelcomeAppModal />
	</div>
</template>

<style scoped>
ion-menu::part(container) {
	@apply bg-transparent;
}

ion-menu ion-header,
ion-menu ion-header ion-toolbar {
	--background: var(--color-background);
	box-shadow: none;
}

ion-menu ion-content::part(background) {
	background: var(--color-background);
}
</style>
