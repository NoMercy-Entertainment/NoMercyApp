<script setup lang="ts">
import { } from 'vue';

import {
  IonPage,
  IonRouterOutlet,
  IonTabs,
} from '@ionic/vue';
import ImageModal from '@/Layout/ImageModal.vue';
import Screensaver from '@/Layout/Screensaver.vue';

import Navbar from './components/NavBar.vue';

</script>

<template>
  <ion-page id="main-content">
    <ion-tabs>
      <Navbar/>
      <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto ">
      </ion-router-outlet>
    </ion-tabs>

    <ImageModal/>
    <!--      <Toast class="z-1199" />-->
    <Screensaver/>
  </ion-page>
</template>

<style scoped>
</style>
