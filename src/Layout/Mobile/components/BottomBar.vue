<script setup lang="ts">
import {type PropType} from 'vue';

import {folder, home1, noteEighthPair, searchMagnifyingGlass} from '@Icons/index';
import {IonIcon, IonLabel, IonTabBar, IonTabButton} from '@ionic/vue';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';

defineProps({
  menuOpen: {
    type: Boolean,
    required: true,
  },
  transparent: {
    type: Boolean,
    required: false,
    default: false,
  },
  openMenu: {
    type: Function as PropType<() => void>,
    required: true,
  },
  closeMenu: {
    type: Function as PropType<(e?: Event) => void>,
    required: true,
  },
  toggleMenu: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

</script>

<template>
  <ion-tab-bar
      slot="bottom"
      mode="ios"
      selected-tab="home"
      :class="{
        ' bg-sand-light-1 dark:bg-slate-dark-3 hide-bg': menuOpen,
        'bg-sand-light-1 dark:bg-slate-dark-3': !menuOpen
     }"
  >

    <ion-tab-button tab="home" href="/home" @click="closeMenu" >
      <ion-icon aria-hidden="true" :icon="home1"/>
      <ion-label>{{ $t('Home') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="search" href="/search" @click="closeMenu">
      <ion-icon aria-hidden="true" :icon="searchMagnifyingGlass"/>
      <ion-label>{{ $t('Search') }}</ion-label>
    </ion-tab-button >

    <ion-tab-button tab="library" href="/libraries" @click="closeMenu">
      <ion-icon aria-hidden="true" :icon="folder" class="icon"/>
      <ion-label>{{ $t('Library') }}</ion-label>
    </ion-tab-button >

    <ion-tab-button tab="music" href="/music/start" @click="closeMenu" >
      <ion-icon aria-hidden="true" :icon="noteEighthPair"/>
      <ion-label>{{ $t('Music') }}</ion-label>
    </ion-tab-button>

    <ion-tab-button @click="toggleMenu()" :class="{'tab-selected': menuOpen}">
      <div class="relative mx-auto flex flex-col rounded-full size-10 my-1">
        <NoMercyAvatar :user="$keycloak.tokenParsed" :size="40" class="absolute"/>
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
  @apply flex flex-col items-center flex-grow flex-shrink-0 bg-transparent;
}

ion-tab-button ion-avatar x {
  @apply w-8 h-8 min-w-8 min-h-8 relative flex mt-2.5 mb-2 text-slate-dark-1 dark:text-slate-light-1;
}

ion-tab-button ion-icon {
  @apply w-8 h-8 min-w-8 min-h-8 relative flex -mb-1 text-slate-dark-1 dark:text-slate-light-1 p-[0.625rem_0.725rem_0.625rem];
}

ion-tab-button ion-label {
  @apply text-slate-dark-1 dark:text-slate-light-1 overflow-visible mb-1 mt-0 text-base;
}

.tab-selected ion-icon {
  transform: rotate(12deg);
}

.tab-selected ion-avatar:after {
  @apply content-[''] -z-10 absolute w-[2.75rem] h-[2.75rem] inset-[-2px_-2px] justify-center items-center rounded-full  bg-gradient-to-b from-violet-dark-10 to-violet-dark-12 dark:from-violet-dark-6 dark:to-violet-dark-8;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.08) inset, 0 -1px 2px 0 rgba(0, 0, 0, 0.16) inset, 0 1px 0 0 rgba(255, 255, 255, 0.25) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.45) inset;
}

ion-tab-bar:not(.hide-bg) .tab-selected ion-icon:after {
  @apply content-[''] -z-10 absolute w-[2.75rem] h-[2.75rem] inset-[4px_5px] justify-center items-center rounded-full  bg-gradient-to-b from-violet-dark-10 to-violet-dark-12 dark:from-violet-dark-6 dark:to-violet-dark-8;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.08) inset, 0 -1px 2px 0 rgba(0, 0, 0, 0.16) inset, 0 1px 0 0 rgba(255, 255, 255, 0.25) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.45) inset;
}

</style>
