<script setup lang="ts">
import { ref } from 'vue';

import {
  IonButtons, IonButton,
  IonContent, modalController,
} from '@ionic/vue';


</script>

<template>
    <ion-content :fullscreen="true" class="ion-padding">

      <ion-buttons >
        <ion-button @click="modalController.dismiss(null, 'cancel');">Close</ion-button>
      </ion-buttons>
    </ion-content>
</template>

<style scoped>

</style>
