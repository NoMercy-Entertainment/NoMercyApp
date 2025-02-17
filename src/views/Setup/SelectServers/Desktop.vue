<script setup lang="ts">
import {onMounted} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';

import type {Server} from '@/types/auth';

import router from '@/router';
import servers from '@/store/servers';
import {setCurrentServer} from '@/store/currentServer';
import {setColorPalette} from "@/store/ui";

import ServerCard from '@/views/Setup/SelectServers/components/ServerCard.vue';

import EmptyBackdrop from "@/components/Images/EmptyBackdrop.vue";

const handleSelectServer = (server: Server) => {
  setCurrentServer(server);

  if (localStorage.getItem('redirectUrl') == '#/setup/select-servers') {
    router.replace('/home');
  } else {
    router.replace(localStorage.getItem('redirectUrl') || '/home');
  }
};

onMounted(() => {
  setCurrentServer(null);
  setColorPalette(null);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex h-full w-full flex-auto flex-col items-center justify-center gap-8">
        <EmptyBackdrop/>

        <div class="flex w-full flex-grow flex-col justify-between p-2 min-h-auto">

          <div class="mt-16 mb-4 w-full whitespace-pre-line">
            <h5 class="relative text-center text-lg font-semibold">
              {{ $t('Choose a server') }}
            </h5>
          </div>

          <div
              class="tv:children:w-[30%] tv:mt-0 -mt-24 tv:-ml-8 flex children:h-fit w-full flex-auto flex-wrap content-center justify-center gap-2 children:w-[47%] sm:children:w-[22%] sm:gap-4">
            <template v-for="server in servers" :key="server.id">
              <ServerCard :server="server" :onclick="() => handleSelectServer(server)"/>
            </template>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
