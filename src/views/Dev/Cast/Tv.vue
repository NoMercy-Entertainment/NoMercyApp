<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ExploreContainer :name="`${router.currentRoute.value.name as string} Desktop page`" />
    </ion-content>
  </ion-page>
</template>
