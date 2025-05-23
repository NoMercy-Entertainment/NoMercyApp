<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

import { connection, dashboardSocketIsConnected } from '@/lib/clients/dashboardSocket';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

import ServerResourceCard from './Components/ServerResouceCard/ServerResourceCard.vue';
import ServerSystemCard from './Components/ServerSystemCard.vue';
import ServerTasksCard from './Components/ServerTasksCard/ServerTasksCard.vue';
import ServerActivityCard from './Components/ServerActivityCard/ServerActivityCard.vue';
import ServerSystemInfoCard from '@/views/Dashboard/System/System/Components/ServerSystemInfoCard.vue';
import useServerClient from "@/lib/clients/useServerClient";
import { currentServer } from "@/store/currentServer";
import {useMediaQuery} from "@vueuse/core";

const showing = ref(true);

watch(connection, (value) => {
  showing.value = !!value;
});

onMounted(() => {
  setTimeout(() => {
    showing.value = !!connection.value;
  }, 1000);
});

const { data: storage, error } = useServerClient({
  path: 'dashboard/server/storage',
  queryKey: ['dashboard', 'storage', currentServer.value?.serverBaseUrl],
});

onMounted(() => {
  console.raw(storage.value);
});

const supportsMasonry = computed(() => window.CSS.supports('grid-template-rows: masonry'))

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <DashboardLayout title="Dashboard overview" :gridStyle="supportsMasonry ? 3 : 2"
                       styles="grid-template-rows: masonry; masonry-auto-flow: next;">
        <template v-slot:cta>
        </template>

        <template v-if="supportsMasonry">
          <ServerSystemInfoCard />
          <ServerTasksCard />
          <ServerActivityCard />
          <ServerResourceCard v-if="dashboardSocketIsConnected" />
          <ServerSystemCard title="Resources monitor" v-else class="animate-pulse">
            <template v-slot:cta>
            </template>
            <div class="min-h-80"></div>
          </ServerSystemCard>
        </template>

        <template v-else>
          <div
            class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-1 xl:row-start-1">
            <ServerSystemInfoCard />

            <ServerResourceCard v-if="dashboardSocketIsConnected" />
            <ServerSystemCard title="Resources monitor" v-else class="animate-pulse">
              <template v-slot:cta>
              </template>
              <div class="min-h-80"></div>
            </ServerSystemCard>
          </div>
          <div
            class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-3 xl:row-start-1">
            <ServerTasksCard />
          </div>
          <div
            class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1 2xl:flex">
            <ServerActivityCard />
          </div>
        </template>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
