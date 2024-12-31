<script setup lang="ts">

import {IonHeader, IonToolbar} from '@ionic/vue';

import {user} from '@/store/user';
import {navBarVisible} from "@/store/ui";
import {isHomeRoute, isLibraryRoute, isMusicRoute} from '@/store/routeState';
import {currentSong, isPlaying, openFullPlayer} from "@/store/audioPlayer";

import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import CoverImage from "@/components/MusicPlayer/components/CoverImage.vue";
import Marquee from "@/components/Marquee.vue";
import EqSpinner from "@/components/Images/EqSpinner.vue";

import NavBarButton from './NavBarButton.vue';
import PlayerIcon from "@/components/Images/icons/PlayerIcon.vue";

</script>

<template>
  <ion-header v-if="navBarVisible" mode="md"
              class="pt-safe transition-all duration-300 !h-[104px]"
  >
    <ion-toolbar mode="md">
      <div class="flex justify-between items-center w-full relative px-14 h-14">

        <button
            v-if="currentSong"
            @click="openFullPlayer()"
            class="flex w-60 -ml-1.5 -mr-48 h-10 my-auto bg-slate-dark-6 pr-2 rounded-full overflow-clip focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline">

          <div class="relative w-10 h-10 aspect-square rounded-full overflow-clip">
            <CoverImage
                :data="currentSong"
                :alt="currentSong.name"
                class="w-auto h-full aspect-square absolute top-0 left-0 brightness-50"
                :class="{
                  '': isPlaying,
                }"
            />

            <div class="flex items-center justify-center w-auto h-full aspect-square absolute top-0 left-0">
              <EqSpinner v-if="isPlaying" :playing="isPlaying"/>
              <PlayerIcon icon="nmPause" v-else class="w-5 h-5 text-white"/>
            </div>
          </div>

          <div class="w-[calc(100%-30px)] flex flex-col justify-center items-start gap-1.5 mr-2 overflow-clip py-0.5 border-[4px] border-l-0 rounded-r-full border-slate-dark-6">
            <Marquee :text="currentSong.name" class="px-2 children:pr-4 text-2xs leading-none !flex-grow-0"/>
            <span class="pl-2 text-3xs text-white line-clamp-1 leading-none">
              {{ currentSong.artist_track?.at(0)?.name }}
            </span>
          </div>

        </button>
        <AppLogoSquare v-else class="w-10 h-10"/>

        <div class="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-3">
          <NavBarButton icon="home1" href="/home" name="Home" :active="isHomeRoute"/>
          <NavBarButton icon="folder" href="/libraries" name="Libraries" :active="isLibraryRoute"/>
          <NavBarButton icon="noteSixteenth" href="/music/start" name="Music" :active="isMusicRoute"/>
        </div>

        <button class="relative flex flex-col rounded-full size-10 my-1 pointer-events-auto">
          <NoMercyAvatar :user="user" :size="40"
                         class="absolute focus-visible:ring-2 ring-inset focus-visible:ring-white"/>
          <span
              class="absolute rounded-full border-white bg-green-600 size-[25%] bottom-[5%] end-[5%] border-[0.125rem] dark:border-stone-900">
        </span>
        </button>

      </div>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>

ion-header {
  background: transparent !important;
}

ion-toolbar {
  --min-height: 80px;
  --padding-top: 1.5rem;
  --padding-bottom: 16px;
  --background: transparent !important;
}

ion-header {
  box-shadow: none;
}

</style>
