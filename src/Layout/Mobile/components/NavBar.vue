<script setup lang="ts">

import {
  IonHeader,
  IonProgressBar,
  IonToolbar,
  isPlatform,
} from '@ionic/vue';
import {useIsFetching} from '@tanstack/vue-query';

import AppLogo from '@/components/Images/icons/AppLogo.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {closeSidebar, sidebarState, toggleSidebar} from '@/store/sidebar';
import {RouterLink} from 'vue-router';
import {searchUrl} from '@/store/routeState';

const isFetching = useIsFetching();

</script>

<template>
  <ion-header
      class="transition-all duration-300"
  >
    <ion-toolbar v-if="!isPlatform('capacitor')" class="relative">
      <div
          class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-[50px] overflow-hidden px-1 py-1.5"
      >
        <button  @click="toggleSidebar"
                 aria-label="menu"
                 class="text-slate-dark-1 dark:text-slate-light-1 flex justify-center items-center flex-grow-0 flex-shrink-0 h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent children:absolute children:transition-opacity children:duration-100 children:inset-4"
        >
          <MoooomIcon icon="cross" :class="{
            'opacity-0': sidebarState == 'closed' || sidebarState == 'hidden',
            'opacity-100': sidebarState == 'open',
          }"/>
          <MoooomIcon icon="menuBurger"  :class="{
            'opacity-100': sidebarState == 'closed' || sidebarState == 'hidden',
            'opacity-0': sidebarState == 'open',
          }"
          />
        </button>
        <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1 h-available">
          <AppLogo />
        </div>
        <RouterLink
            :to="searchUrl"
            @click="closeSidebar"
            aria-label="search"
            class="flex justify-center items-center flex-grow-0 flex-shrink-0  h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent"
        >
          <MoooomIcon icon="searchMagnifyingGlass" class="text-slate-dark-1 dark:text-slate-light-1" />
        </RouterLink>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-progress-bar v-if="isFetching > 0" type="indeterminate"></ion-progress-bar>
</template>

<style scoped>
ion-header {
  @apply bg-gradient-to-l from-violet-dark-11/80 to-violet-dark-10/80 dark:from-violet-dark-8 dark:to-violet-dark-4 relative;
  box-shadow: none;
}

ion-header ion-toolbar {
  --background: var(--color-background);
  @apply h-14 relative;
}

</style>
