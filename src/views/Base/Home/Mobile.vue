<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';
</script>

<template>
  <ion-page>
    <NavBar />
    <ion-content :fullscreen="true">

      <ExploreContainer name="Home Mobile page" />
    </ion-content>
  </ion-page>
</template>
