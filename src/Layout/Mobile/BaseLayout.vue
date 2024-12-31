<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import router from '@/router';

import {IonPage, IonRouterOutlet, IonTabs, isPlatform,} from '@ionic/vue';

import {lockPortrait, unlockOrientation} from '@/lib/utils';
import {closeMenu} from '@/store/profileMenu';

import ImageModal from '@/Layout/ImageModal.vue';
import Screensaver from '@/Layout/Screensaver.vue';

import FullPlayer from '@/components/MusicPlayer/mobile/FullPlayer.vue';
import MiniPlayer from '@/components/MusicPlayer/mobile/MiniPlayer.vue';

import ProfileMenu from './components/menus/ProfileMenu.vue';
import BottomBar from './components/BottomBar.vue';
import SideFlyout from './components/SideFlyout.vue';
import NavBar from './components/NavBar.vue';
import {currentSong} from '@/store/audioPlayer';
import EqualizerMenu from "@/Layout/Mobile/components/menus/EqualizerMenu.vue";
import ChristmasSnow from "@/components/Seasonal/Christmas/ChristmasSnow.vue";

onMounted(() => {
  lockPortrait();
  router.afterEach(() => {
    closeMenu();
  });
});

onUnmounted(() => {
  unlockOrientation();
});

</script>

<template>
  <ion-page id="main-content">
    <ion-tabs>
<!--      <NavBar/>-->
      <ChristmasSnow />

      <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto">
      </ion-router-outlet>

      <ProfileMenu/>
      <EqualizerMenu/>

      <FullPlayer v-if="currentSong"/>
      <MiniPlayer v-if="currentSong"/>

      <BottomBar/>
    </ion-tabs>

    <ImageModal/>
    <!--      <Toast class="z-1199" />-->
    <Screensaver/>

    <SideFlyout v-if="!isPlatform('capacitor')"/>
  </ion-page>
</template>

<style scoped>
ion-menu::part(container) {
  @apply bg-transparent
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
