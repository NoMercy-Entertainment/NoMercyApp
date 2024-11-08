<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';

console.log('Desktop.vue', router.currentRoute.value);

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer :name="`Artist ${router.currentRoute.value.params.id} x Desktop page`" />
    </ion-content>
  </ion-page>
</template>
