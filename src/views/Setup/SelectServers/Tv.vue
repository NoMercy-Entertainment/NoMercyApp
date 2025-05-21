<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {IonPage, IonContent, onIonViewWillEnter} from '@ionic/vue';

import type {Server} from '@/types/auth';

import router from '@/router';
import servers from '@/store/servers';
import {setCurrentServer} from '@/store/currentServer';
import {hideNavBar, showNavBar} from "@/store/ui";

import ServerCard from '@/views/Setup/SelectServers/components/ServerCard.vue';
import {user} from "@/store/user";
import NoMercyAvatar from "@/components/Images/NoMercyAvatar.vue";
import {RouterLink} from "vue-router";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import {deviceIsTv, isTv, tvModeOverride} from "@/config/global";

const serverList = ref<HTMLElement>();

const handleSelectServer = (server: Server) => {
  setCurrentServer(server);

  router.replace('/home');
};

onMounted(() => {
  setCurrentServer(null);
  hideNavBar();
});

onUnmounted(() => {
  showNavBar();
});

onIonViewWillEnter(() => {
  setTimeout(() => {
    serverList.value?.querySelector('button')?.focus();
  }, 100);
});

watch(serverList, (value) => {
  setTimeout(() => {
    value?.querySelector('button')?.focus();
  }, 100);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex h-full w-full flex-auto flex-col items-center justify-center gap-8 p-8">
        <!--        <EmptyBackdrop />-->

        <div class="flex w-full flex-grow flex-col justify-between p-2 min-h-auto">

          <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 w-full relative gap-2.5 mb-2">

          <div class="flex justify-start items-center relative gap-2.5" inert>
            <div class="size-12 my-auto">
              <NoMercyAvatar :user="user" :size="40"/>
            </div>
            <p class="w-48 text-base font-semibold text-left text-slate-dark-1 dark:text-slate-light-1">
              {{ user.name }}
            </p>
          </div>

          <div tabindex="0" @click="tvModeOverride = !tvModeOverride" v-show="!isTv"
                      class="flex justify-center items-center ml-auto relative gap-1.5 pl-3 pr-4 py-2.5 h-10 opacity-40 rounded-full border-[1.5px] border-[#c4c7c5]">
            <MoooomIcon icon="doorOut" class="text-slate-dark-1 dark:text-slate-light-1"/>
            <span class="flex-grow-0 flex-shrink-0 opacity-80 text-sm font-medium text-center text-[#e3e3e3]">
                {{ $t('Exit TV mode') }}
              </span>
          </div>

          <RouterLink to="/logout"
                      class="flex justify-center items-center relative gap-1.5 pl-3 pr-4 py-2.5 h-10 opacity-40 rounded-full border-[1.5px] border-[#c4c7c5]">
            <MoooomIcon icon="doorOut" class="text-slate-dark-1 dark:text-slate-light-1"/>
            <span class="flex-grow-0 flex-shrink-0 opacity-80 text-sm font-medium text-center text-[#e3e3e3]">
                {{ $t('Logout') }}
              </span>
          </RouterLink>
          </div>


          <div ref="serverList"
               class="tv:children:w-[30%] tv:mt-0 -mt-24 flex children:h-fit w-full flex-auto flex-wrap content-center justify-center gap-2 children:w-[47%] sm:children:w-[22%] sm:gap-4">
            <template v-for="server in servers" :key="server.id">
              <ServerCard :server="server" :onclick="() => handleSelectServer(server)"/>
            </template>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>
