<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ExploreContainer name="Dashboard System Tv page" />
    </ion-content>
  </ion-page>
</template>
