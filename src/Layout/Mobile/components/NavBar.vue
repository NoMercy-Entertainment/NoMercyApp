<script setup lang="ts">
import { RouterLink } from 'vue-router';

import {
  IonHeader,
  IonProgressBar,
  IonToolbar,
  isPlatform,
} from '@ionic/vue';
import { useIsFetching } from '@tanstack/vue-query';

import { closeSidebar, sidebar, toggleSidebar } from '@/store/sidebar';
import { isTv } from "@/config/global";
import { searchUrl } from '@/store/routeState';

import MobileLibraryHeader from '@/views/Base/Library/components/MobileLibraryHeader.vue';
import AppLogo from '@/components/Images/icons/AppLogo.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const isFetching = useIsFetching();

</script>

<template>
  <ion-header class="pt-safe transition-all duration-200">
    <ion-toolbar v-if="!isPlatform('capacitor') && !isTv">
      <div
        class="pt-safe flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-[50px] overflow-hidden px-1 py-1.5">
        <button @click="toggleSidebar" aria-label="menu"
          class="text-slate-dark-1 dark:text-slate-light-1 flex justify-center items-center flex-grow-0 flex-shrink-0 h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent children:absolute children:transition-opacity children:duration-100 children:inset-4">
          <MoooomIcon icon="cross" :class="{
            'opacity-0': sidebar == 'closed' || sidebar == 'hidden',
            'opacity-100': sidebar == 'open',
          }" />
          <MoooomIcon icon="menuBurger" :class="{
            'opacity-100': sidebar == 'closed' || sidebar == 'hidden',
            'opacity-0': sidebar == 'open',
          }" />
        </button>
        <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1 h-available">
          <AppLogo />
        </div>
        <RouterLink :to="searchUrl" @click="closeSidebar" aria-label="search"
          class="flex justify-center items-center flex-grow-0 flex-shrink-0  h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent">
          <MoooomIcon icon="searchMagnifyingGlass" class="text-slate-dark-1 dark:text-slate-light-1" />
        </RouterLink>
      </div>
    </ion-toolbar>
    <MobileLibraryHeader />
  </ion-header>

  <ion-progress-bar v-if="isFetching > 0" type="indeterminate"
    class="absolute mt-safe top-0 z-1199 bg-black"></ion-progress-bar>
</template>

<style scoped>
ion-header {
  background: var(--color-background);
  box-shadow: none;
}

ion-toolbar {
  --background: var(--color-background);
}

ion-progress-bar::part(track) {
  @apply bg-focus/50;
}

ion-progress-bar::part(progress) {
  @apply bg-focus;
}
</style>
