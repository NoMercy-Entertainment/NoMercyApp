<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import {setColorPalette} from '@/store/ui';
import {onMounted} from 'vue';

onMounted(() => {
  setColorPalette(null);
});
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer :name="`Libraries Desktop page`" />
    </ion-content>
  </ion-page>
</template>
