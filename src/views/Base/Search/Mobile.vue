<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import router from '@/router';

import ExploreContainer from '@/components/ExploreContainer.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';

</script>

<template>
  <ion-page>
    <NavBar />
    <ion-content :fullscreen="true">

      <ExploreContainer :name="`${router.currentRoute.value.name as string} Mobile page`" />
    </ion-content>
  </ion-page>
</template>
