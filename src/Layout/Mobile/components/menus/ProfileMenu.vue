<script setup lang="ts">
import {RouterLink} from 'vue-router';
import {IonIcon, IonRippleEffect} from '@ionic/vue';
import {arrowRefreshVertical, doorOpen, gridMasonry, monitor, moonDiagonal, serverSwitch} from '@Icons/index';

import {darkMode} from '@/store/colorScheme';

import ProfileMenuServerSection from '@/Layout/Mobile/components/ProfileMenuServerSection.vue';
import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';

import Toggle from '@/components/Forms/Toggle.vue';

const reload = () => window.location.reload();

</script>

<template>

  <BottomFlyout >
    <div
        class="flex z-1099 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
    >
      <ProfileMenuServerSection/>
    </div>
    <div
        class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
    >

      <RouterLink
          to="/setup/select-servers"
          class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
      >
        <ion-ripple-effect/>
        <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
        <ion-icon aria-hidden="true" :icon="serverSwitch" class="w-6 h-6"/>
        <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
          <p class="flex-grow w-full text-lg font-medium text-left">
            {{ $t('Switch server') }}
          </p>
        </div>
      </RouterLink>

    </div>
    <div
        class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
    >

      <RouterLink
          to="/preferences/display"
              class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
      >
        <ion-ripple-effect/>
        <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
        <ion-icon aria-hidden="true" :icon="monitor" class="w-6 h-6"/>
        <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
          <p class="flex-grow w-full text-lg font-medium text-left">
            {{ $t('Preferences') }}
          </p>
        </div>
      </RouterLink>

      <RouterLink
          to="/dashboard/system"
              class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
      >
        <ion-ripple-effect/>
        <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
        <ion-icon aria-hidden="true" :icon="gridMasonry" class="w-6 h-6"/>
        <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
          <p class="flex-grow w-full text-lg font-medium text-left">
            {{ $t('System') }}
          </p>
        </div>
      </RouterLink>

      <button @click="reload()"
              class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
      >
        <ion-ripple-effect/>
        <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
        <ion-icon aria-hidden="true" :icon="arrowRefreshVertical" class="w-6 h-6"/>
        <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
          <p class="flex-grow w-full text-lg font-medium text-left">
            {{ $t('Refresh') }}
          </p>
        </div>
      </button>

      <button @click="darkMode = !darkMode"
              class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
      >
        <ion-icon aria-hidden="true" :icon="moonDiagonal" class="w-6 h-6"/>
        <label
            for="ion-tg-0"
             class="flex justify-center items-center flex-grow relative gap-2 px-2">
          <span class="flex-grow w-[255px] text-lg font-medium text-left">
            {{ $t('Dark mode') }}
          </span>
        </label>
        <Toggle :model-value="darkMode" @update:model-value="darkMode = $event"/>
      </button>
    </div>

    <div
        class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2"
    >
      <button @click="$keycloak.keycloak?.logout()"
              class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
      >
        <ion-ripple-effect/>
        <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
        <ion-icon aria-hidden="true" :icon="doorOpen" class="w-6 h-6"/>
        <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
          <p class="flex-grow w-full text-lg font-medium text-left">
            {{ $t('Logout') }}
          </p>
        </div>
      </button>
    </div>
  </BottomFlyout>
</template>

<style scoped>

</style>
