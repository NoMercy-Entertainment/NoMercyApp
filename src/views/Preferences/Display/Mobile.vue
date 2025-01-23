<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';

import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import DeviceName from "@/views/Preferences/Display/components/DeviceName.vue";
import DisplayLanguage from "@/views/Preferences/Display/components/DisplayLanguage.vue";
import DisplayStyles from "@/views/Preferences/Display/components/DisplayStyles.vue";
import ScreensaverSettings from "@/views/Preferences/Display/components/ScreensaverSettings.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout title="Display settings" :gridStyle="3" :allowAnyone="true">
        <div class="flex flex-col p-4 gap-4">
          <DeviceName />
          <DisplayLanguage />
          <ScreensaverSettings />
          <DisplayStyles />
        </div>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
