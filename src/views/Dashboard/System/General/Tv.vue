<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ExploreContainer name="General Tv page" />
    </ion-content>
  </ion-page>
</template>
