<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';

import Chromecast from "@/components/Buttons/Chromecast.vue";
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout title="Notifications" :gridStyle="2">
        <template v-slot:cta>
        </template>
        <div class="grid place-content-center w-available h-available">
          <Chromecast/>
        </div>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
