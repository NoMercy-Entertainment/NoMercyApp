<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';

import {connection} from '@/lib/clients/dashboardSocket';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

import ServerResourceCard from './Components/ServerResouceCard/ServerResourceCard.vue';
import ServerSystemCard from './Components/ServerSystemCard.vue';
import ServerPathsCard from './Components/ServerPathsCard.vue';
import ServerTasksCard from './Components/ServerTasksCard/ServerTasksCard.vue';
import ServerActivityCard from './Components/ServerActivityCard/ServerActivityCard.vue';
import ServerSystemInfoCard from '@/views/Dashboard/System/System/Components/ServerSystemInfoCard.vue';

const showing = ref(true);

watch(connection, (value) => {
  showing.value = !!value;
});

onMounted(() => {
  setTimeout(() => {
    showing.value = !!connection.value;
  }, 1000);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <DashboardLayout title="Dashboard overview" :gridStyle="2">
        <template v-slot:cta>
        </template>

        <div class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-1 xl:row-start-1">
          <ServerSystemInfoCard />

          <ServerResourceCard v-if="showing" />
          <ServerSystemCard title="Resources monitor" v-else class="animate-pulse">
            <template v-slot:cta>
            </template>
            <div class="min-h-80"></div>
          </ServerSystemCard>

          <ServerPathsCard  class="hidden lg:flex xl:hidden"/>
        </div>

        <div class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-3 xl:row-start-1">
          <ServerTasksCard />
          <!--            <ServerPathsCard  class="flex lg:hidden xl:flex"/>-->

          <ServerActivityCard class="hidden lg:flex 2xl:hidden" />
        </div>

        <div
            class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1 2xl:flex">
          <ServerActivityCard />
        </div>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
