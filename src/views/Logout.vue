<script setup lang="ts">
import { onMounted } from 'vue';
import { App } from '@capacitor/app';
import { IonContent, IonPage } from '@ionic/vue';

import { clearTokens } from '@/lib/auth/index';

import ExploreContainer from '@/components/ExploreContainer.vue';

onMounted(async () => {
  clearTokens();
  setTimeout(() => {
    App.exitApp();
  }, 3000);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer name="Logging out..." />
    </ion-content>
  </ion-page>
</template>
