<script setup lang="ts">
import { IonPage, IonRouterOutlet, IonTabs } from '@ionic/vue';

import { currentSong } from '@/store/audioPlayer';

import ImageModal from '@/Layout/ImageModal.vue';
// import Screensaver from '@/Layout/Screensaver.vue';

import Navbar from './components/NavBar.vue';
import FullTvPlayer from '@/components/MusicPlayer/tv/FullTvPlayer.vue';
</script>

<template>
	<IonPage id="main-content" mode="md">
		<IonTabs mode="md">
			<Navbar />
			<IonRouterOutlet
				animated="false"
			/>
		</IonTabs>

		<ImageModal />
		<!--      <Toast class="z-1199" /> -->
		<!--    <Screensaver /> -->
		<FullTvPlayer v-if="currentSong" />
	</IonPage>
</template>

<style scoped></style>
