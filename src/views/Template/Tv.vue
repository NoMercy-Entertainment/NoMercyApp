<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';
import router from '@/router';
</script>

<template>
  <ion-page>
    <NavBar :title="router.currentRoute.value.name as string" />
    <ion-content :fullscreen="true">

      <ExploreContainer :name="`${router.currentRoute.value.name as string} Desktop page`" />
    </ion-content>
  </ion-page>
</template>
