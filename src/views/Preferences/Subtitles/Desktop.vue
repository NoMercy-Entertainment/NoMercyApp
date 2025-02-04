<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout :gridStyle="1" title="Subtitle settings">
        <template v-slot:cta>
          <!--          <Button id="invite" color="theme" startIcon="userAdd" @click="{}">-->
          <!--            {{ $t('Invite user') }}-->
          <!--          </Button>-->
        </template>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
