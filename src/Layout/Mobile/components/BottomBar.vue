<script setup lang="ts">
import { computed } from 'vue';
import { folder, home1, noteEighthPair, searchMagnifyingGlass } from '@Icons/index';
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/vue';

import { user } from '@/store/user';
import { closeMenu, menuOpen, toggleMenu } from '@/store/profileMenu';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import { useRoute } from 'vue-router';
import {currentServer} from "@/store/currentServer";

const route = useRoute();

const searchUrl = computed(() => {
  if (route.path.includes('/music')) {
    return '/music/search';
  }
  return '/search';
});

</script>

<template>
  <ion-tab-bar slot="bottom" mode="md" selected-tab="home"
               class="w-available overflow-clip"
               :class="{
                'bg-sand-light-1 dark:bg-slate-dark-3 hide-bg': menuOpen,
                'bg-sand-light-1 dark:bg-slate-dark-3': !menuOpen
              }">

    <ion-tab-button tab="home" href="/home" @click="closeMenu()" v-if="currentServer">
      <ion-icon aria-hidden="true" :icon="home1" />
      <ion-label>{{ $t('Home') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="search" :href="searchUrl" @click="closeMenu()">
      <ion-icon aria-hidden="true" :icon="searchMagnifyingGlass" />
      <ion-label>{{ $t('Search') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="library" href="/libraries" @click="closeMenu()" v-if="currentServer">
      <ion-icon aria-hidden="true" :icon="folder" class="icon" />
      <ion-label>{{ $t('Library') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="music" href="/music/start" @click="closeMenu()" v-if="currentServer">
      <ion-icon aria-hidden="true" :icon="noteEighthPair" />
      <ion-label>{{ $t('Music') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button :_on-click="toggleMenu" @click="toggleMenu()" tab="/dashboard" class="hide-bg"
      :class="{ 'tab-selected': menuOpen }">
      <div class="relative mx-auto flex flex-col rounded-full size-12 mt-1.5">
        <NoMercyAvatar :user="user" :size="52" class="absolute" />
        <span
          class="absolute rounded-full border-white bg-green-600 size-[25%] bottom-[5%] end-[5%] border-[0.125rem] dark:border-stone-900">
        </span>
      </div>
      <ion-label>{{ $t('Profile') }}</ion-label>
    </ion-tab-button>

  </ion-tab-bar>
</template>

<style scoped>
ion-tab-bar {
  @apply flex justify-center items-center self-stretch h-20;
}

ion-tab-button {
  @apply flex flex-col items-center flex-grow flex-shrink bg-transparent;
}

ion-tab-button::part(native) {
  --padding-start: 0.25rem;
  --padding-end: 0.25rem;
}

ion-tab-button ion-avatar x {
  @apply w-8 h-8 min-w-8 min-h-8 relative flex mt-2.5 mb-2 text-slate-dark-1 dark:text-slate-light-1;
}

ion-tab-button ion-icon {
  @apply w-8 h-8 min-w-8 min-h-8 relative flex -mb-1 text-slate-dark-1 dark:text-slate-light-1 p-[0.625rem_0.725rem_0.625rem];
}

ion-tab-button ion-label {
  @apply text-slate-dark-1 dark:text-slate-light-1 overflow-visible mb-1 mt-0 text-2xs text-center;
}

.tab-selected ion-icon {
  transform: rotate(12deg);
}

ion-tab-bar:not(.hide-bg) .tab-selected ion-icon:after {
  @apply content-[''] -z-10 absolute w-[2.75rem] h-[2.75rem] inset-[4px_5px] justify-center items-center rounded-full bg-focus dark:brightness-[0.6] shadow-none dark:shadow-none hover:shadow-none dark:hover:shadow-none active:shadow-none active:dark:shadow-none;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.08) inset, 0 -1px 2px 0 rgba(0, 0, 0, 0.16) inset, 0 1px 0 0 rgba(255, 255, 255, 0.25) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.45) inset;
}
</style>
