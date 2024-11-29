<script setup lang="ts">
import {ref} from "vue";

import {IonHeader, IonToolbar} from '@ionic/vue';

import {user} from '@/store/user';
import {navBarVisible} from "@/store/ui";
import {isHomeRoute, isLibraryRoute, isMusicRoute} from '@/store/routeState';

import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import NavBarButton from '@/Layout/Tv/components/NavBarButton.vue';

</script>

<template>
  <ion-header v-if="navBarVisible"
      class="pt- safe transition-all duration-300 pointer-events-none"
  >
    <ion-toolbar>
  <div class="flex justify-between items-center w-full relative px-16">
    <AppLogoSquare class="w-10 h-10" />

    <div class="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-3">
      <NavBarButton icon="home1" href="/home" name="Home" :active="isHomeRoute"/>
      <NavBarButton icon="folder" href="/libraries" name="Library" :active="isLibraryRoute"/>
      <NavBarButton icon="noteDouble" href="/music/start" name="Music" :active="isMusicRoute"/>
    </div>

    <button class="relative flex flex-col rounded-full size-10 my-1 pointer-events-auto">
      <NoMercyAvatar :user="user" :size="40" class="absolute focus-visible:ring-2 ring-inset focus-visible:ring-white"/>
      <span
          class="absolute rounded-full border-white bg-green-600 size-[25%] bottom-[5%] end-[5%] border-[0.125rem] dark:border-stone-900">
        </span>
    </button>

  </div>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>

ion-toolbar {
  --min-height: 80px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --background: transparent;
}

ion-header {
  box-shadow: none;
}

</style>
