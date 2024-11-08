<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

const props = defineProps({
  type: {
    type: String,
    required: true
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer :name="`List ${props.type} Desktop page`" />
    </ion-content>
  </ion-page>
</template>
