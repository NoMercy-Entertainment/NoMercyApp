<script setup lang="ts">
import { onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useQueryClient } from '@tanstack/vue-query';

import router from '@/router';
import servers from '@/store/servers';
import { setCurrentServer } from '@/store/currentServer';
import { clearLibraries } from '@/store/Libraries';

import ServerCard from '@/views/Setup/SelectServers/components/ServerCard.vue';
import { Server } from '@/types/auth';

const handleSelectServer = (server: Server) => {
  setCurrentServer(server);
  router.replace('/home');
};

const queryClient = useQueryClient();

onMounted(() => {
  setCurrentServer(null);
  queryClient.invalidateQueries();
  queryClient.removeQueries();
  queryClient.clear()
  clearLibraries();
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex h-full w-full flex-auto flex-col items-center justify-center gap-8">
        <svg viewBox="0 0 814 806" fill="none"
          class="pointer-events-none absolute h-screen w-screen flex-shrink-0 flex-grow-0 left-[-714px] top-[-722px]"
          preserveAspectRatio="none">
          <g opacity="0.24">
            <mask id="mask0_2999_9934" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-814" y="-822" width="1628"
              height="1628">
              <circle cy="-8" r="814" fill="url(#paint0_radial_2999_9934)"></circle>
            </mask>
            <g mask="url(#mask0_2999_9934)">
              <circle cy="-8" r="814" fill="#6E56CF"></circle>
            </g>
          </g>
          <defs>
            <radialGradient id="paint0_radial_2999_9934" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
              gradientTransform="translate(0 -8) rotate(-90) scale(814)">
              <stop stop-color="#D9D9D9" offset="0"></stop>
              <stop offset="1" stop-color="#737373" stop-opacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>

        <div class="flex w-full flex-grow flex-col justify-between p-2 min-h-auto">

          <div class="mt-16 mb-4 w-full whitespace-pre-line">
            <h5 class="relative text-center text-lg font-semibold text-contrast">
              {{ $t('Choose a server') }}
            </h5>
          </div>

          <div
            class="tv:children:w-[30%] tv:mt-0 -mt-24 tv:-ml-8 flex children:h-fit w-full flex-auto flex-wrap content-center justify-center gap-2 children:w-[47%] sm:children:w-[22%] sm:gap-4">
            <template v-for="server in servers" :key="server.id">
              <ServerCard :server="server" :onclick="() => handleSelectServer(server)" />
            </template>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
