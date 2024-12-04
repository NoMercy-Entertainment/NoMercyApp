<script setup lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout title="Notifications" :gridStyle="2">
        <template v-slot:cta>
        </template>
        <ExploreContainer :name="`${router.currentRoute.value.name as string} Desktop page`"/>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
