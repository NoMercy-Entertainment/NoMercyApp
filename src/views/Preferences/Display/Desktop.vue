<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';

import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import DeviceName from "@/views/Preferences/Display/components/DeviceName.vue";
import ThemePreview from "@/views/Preferences/Display/components/ThemePreview.vue";
import DisplayLanguage from "@/views/Preferences/Display/components/DisplayLanguage.vue";
import ThemeColors from "@/views/Preferences/Display/components/ThemeColors.vue";
import ScreensaverSettings from "@/views/Preferences/Display/components/ScreensaverSettings.vue";
import DisplayStyles from "@/views/Preferences/Display/components/DisplayStyles.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout title="Display settings" :gridStyle="2" :allowAnyone="true">
        <template v-slot:cta>
        </template>

        <div class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-1 xl:row-start-1">
          <DeviceName />
          <ThemePreview />
        </div>

        <div class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-3 xl:row-start-1">
          <DisplayLanguage />
          <ThemeColors />
        </div>

        <div
            class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1 2xl:flex">
          <ScreensaverSettings />
          <DisplayStyles />
        </div>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
