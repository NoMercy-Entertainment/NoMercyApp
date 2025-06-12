<script setup lang="ts">
import {useRoute} from "vue-router";
import { IonContent, IonPage } from '@ionic/vue';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';

const route = useRoute();

</script>
<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScrollContainer :autoHide="true" :static="true">
        <NMComponent :path="route.path" />
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
