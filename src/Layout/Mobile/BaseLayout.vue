<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import router from '@/router';
import { useIsFetching } from '@tanstack/vue-query';

import {
	IonPage,
	IonProgressBar,
	IonRouterOutlet,
	IonTabs,
} from '@ionic/vue';

import { lockPortrait, unlockOrientation } from '@/lib/utils';
import { closeMenu } from '@/store/profileMenu';
import { currentSong, fullPlayerModalOpen } from '@/store/audioPlayer';

import ImageModal from '@/Layout/ImageModal.vue';
// import Screensaver from '@/Layout/Screensaver.vue';
import DeviceOverlay from '@/Layout/Desktop/components/Overlays/DeviceOverlay.vue';

import FullPlayer from '@/components/MusicPlayer/mobile/FullPlayer.vue';
import MiniPlayer from '@/components/MusicPlayer/mobile/MiniPlayer.vue';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';

import ProfileMenu from './components/menus/ProfileMenu.vue';
import BottomBar from './components/BottomBar.vue';
import MobileLibraryHeader from '@/views/Base/Library/components/MobileLibraryHeader.vue';

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
	<IonPage id="main-content">
		<IonTabs>
			<IonProgressBar
				v-if="isFetching > 0"
				type="indeterminate"
				class="absolute top-0 z-1199 bg-black"
			/>
			<ChristmasSnow />
			<MobileLibraryHeader />

			<IonRouterOutlet
				animated="false"
			/>

			<ProfileMenu />
			<!--			<EqualizerMenu /> -->
			<DeviceOverlay class="!z-10" />

			<BottomBar />

			<FullPlayer
				v-if="currentSong?.id"
				:key="fullPlayerModalOpen ? 'full-player-open' : 'full-player-closed'"
			/>
			<MiniPlayer
				:key="!fullPlayerModalOpen ? 'mini-player-open' : 'mini-player-closed'"
			/>

			<ImageModal />
			<!--      <Toast class="z-1199" /> -->
			<!--      <Screensaver /> -->
		</IonTabs>
	</IonPage>
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

ion-progress-bar::part(track) {
	@apply bg-focus/50;
}

ion-progress-bar::part(progress) {
	@apply bg-focus;
}
</style>
