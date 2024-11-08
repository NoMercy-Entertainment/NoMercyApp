<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer :name="`Collection Desktop page`" />
    </ion-content>
  </ion-page>
</template>
