<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import router from '@/router';

import ExploreContainer from '@/components/ExploreContainer.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';
import {onMounted} from 'vue';
import {setColorPalette} from '@/store/ui';

onMounted(() => {
  setColorPalette(null);
});
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ExploreContainer :name="`${router.currentRoute.value.name as string} Mobile page`" />
    </ion-content>
  </ion-page>
</template>
