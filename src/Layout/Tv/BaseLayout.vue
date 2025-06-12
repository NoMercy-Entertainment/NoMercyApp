<script setup lang="ts">

import {
  IonPage,
  IonRouterOutlet,
  IonTabs,
} from '@ionic/vue';


import { currentSong } from "@/store/audioPlayer";

import ImageModal from '@/Layout/ImageModal.vue';
// import Screensaver from '@/Layout/Screensaver.vue';

import Navbar from './components/NavBar.vue';
import FullTvPlayer from "@/components/MusicPlayer/tv/FullTvPlayer.vue";

</script>

<template>
  <ion-page id="main-content" mode="md">
    <ion-tabs mode="md">
      <Navbar />
      <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto ">
      </ion-router-outlet>
    </ion-tabs>

    <ImageModal />
    <!--      <Toast class="z-1199" />-->
<!--    <Screensaver />-->
    <FullTvPlayer v-if="currentSong" />
  </ion-page>
</template>

<style scoped></style>
