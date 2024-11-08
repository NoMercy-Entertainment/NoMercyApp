<script setup lang="ts">
import {ref} from 'vue';

import {
  IonPage,
  IonRouterOutlet, IonTabs,
} from '@ionic/vue';

import {VueQueryDevtools} from '@tanstack/vue-query-devtools'

import {konamiEnabledState} from '@/store/konami';

import Indexer from '@/Layout/Indexer.vue';
import ImageModal from '@/Layout/ImageModal.vue';
import Screensaver from '@/Layout/Screensaver.vue';

import Navbar from './components/Navbar/Navbar.vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import GradientBorder from './components/GradientBorder.vue';
import ScrollContainer from './components/ScrollContainer.vue';
import QueueOverlay from './components/Overlays/QueueOverlay.vue';
import LyricsOverlay from './components/Overlays/LyricsOverlay.vue';
import DeviceOverlay from './components/Overlays/DeviceOverlay.vue';

import MusicPlayerDesktop from '@/components/MusicPlayer/MusicPlayerDesktop.vue';
import router from '@/router';

const focusColor = ref<string | null>(null);
const hideBorder = ref<boolean>(false);
const backgroundUrl = ref<string | null>(null);
const background = ref<boolean>(false);

</script>

<template>
  <ion-page>
    <div class="contents tv:hidden text-auto-12 bg-slate-light-1 dark:bg-slate-dark-2"
         :style="focusColor ? `--color-focus: ${focusColor}` : ''"
    >
      <Navbar/>
      <div
          class="relative z-0 bg-slate-light-1 dark:bg-slate-dark-1 flex h-px flex-1 flex-grow items-start justify-start self-stretch overflow-auto pb-4 w-available h-available scrollbar-none group">

        <Sidebar/>

        <GradientBorder :hideBorder="hideBorder">
          <div id="mainContent"
               class="flex w-px flex-1 flex-col relative overflow-clip justify-start items-start w-available h-available sm:rounded-2xl border-auto-alpha-2 !bg-cover children:scrollbar-none bg-auto-alpha-2 z-0"
               :style="`
                        box-shadow: 0 1px 3px 0 rgba(16,24,40,0.1), 0 1px 2px 0 rgba(16,24,40,0.06);
                        background-image: ${backgroundUrl && !backgroundUrl.includes('null') ? `url(${backgroundUrl})` : ''};
                     `"
          >
            <!--									<Shadow/>-->
            <div id="overlay" class="pointer-events-none absolute inset-0 hidden dark:flex"
                 :style="`
                    background: ${background ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)'};
                 `"
            ></div>
            <div
                class="flex flex-col relative overflow-auto justify-start items-start w-available h-available sm:rounded-2xl flex-1 border-auto-alpha-2 !bg-cover children:scrollbar-none sm:border-3">
              <ScrollContainer :autoHide="true">
                <main id="main"
                      class="flex h-auto flex-1 flex-grow flex-col items-start justify-start self-stretch bg-cover bg-center bg-no-repeat will-change-auto min-h-available w-available scrollbar-none sm:child:border-2 sm:rounded-2xl"
                      style=" box-shadow: 0 1px 3px 0 rgba(16,24,40,0.1), 0 1px 2px 0 rgba(16,24,40,0.06); ">

                  <ion-tabs>
                    <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto">
                    </ion-router-outlet>
                  </ion-tabs>
                </main>
              </ScrollContainer>
            </div>
            <div class="contents" id="slide-container"></div>
          </div>

          <LyricsOverlay class="hidden sm:block"/>
          <QueueOverlay />
          <DeviceOverlay />

        </GradientBorder>
        <Indexer />
      </div>

      <MusicPlayerDesktop />
      <ImageModal />
<!--      <Toast class="z-1199" />-->
      <Screensaver />
      <VueQueryDevtools v-if="konamiEnabledState" buttonPosition="bottom-left"/>
    </div>
  </ion-page>
</template>

<style scoped>

</style>
