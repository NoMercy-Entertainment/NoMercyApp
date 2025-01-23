<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';

import ServerSystemInfoCard from "./Components/ServerSystemInfoCard.vue";
import ServerTasksCard from "./Components/ServerTasksCard/ServerTasksCard.vue";
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout title="Dashboard overview" :gridStyle="3">
        <ServerSystemInfoCard />

        <ServerTasksCard />
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
