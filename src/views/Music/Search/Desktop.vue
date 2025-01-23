<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewWillEnter } from '@ionic/vue';
import { musicSearchResult, musicSearchValue } from '@/store/search';
import { setColorPalette } from '@/store/ui';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import { greetingValue } from '@/config/global';

const search = ref();

onIonViewWillEnter(() => {
  setColorPalette(null);
});

onMounted(() => {
  setTimeout(() => {
    search.value.focus();
  }, 100);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div :class="{
        'w-available relative flex flex-col items-center gap-12 m-3 overflow-clip rounded-2xl transform-all duration-300 will-change-auto': true,
        'h-24 min-h-24 ': musicSearchResult && musicSearchResult.length > 0,
        'h-[360px] min-h-[260px] ': !musicSearchResult || musicSearchResult.length == 0
      }">
        <CosmosBg2 />
        <div v-if="greetingValue && !musicSearchResult"
          class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p class="flex-shrink-0 flex-grow-0 text-7xl font-black">
            {{ $t('Good') }}
            <span class="" id="greeting">
              {{ greetingValue }}
            </span>
          </p>
          <p class="flex-shrink-0 flex-grow-0 text-3xl font-medium">
            {{ $t('What would you like to listen to?') }}
          </p>
        </div>
        <div
          class="relative my-auto flex w-full flex-shrink-0 flex-grow-0 items-center justify-start gap-5 self-center overflow-hidden rounded-2xl border-2 bg-white dark:bg-black border-auto-10 sm:w-3/5"
          :class="{
            'mb-16': !musicSearchResult
          }">
          <label class="flex w-available">
            <input id="search" placeholder="Search for an Artist, Album or Track..." ref="search"
              class="w-full flex-shrink-0 border-transparent bg-transparent px-6 py-4 text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none] !text-slate-light-12 dark:!text-slate-dark-12"
              v-model="musicSearchValue" name="search" type="search" autocomplete="off" />
          </label>
        </div>
      </div>

      <template v-if="musicSearchResult">
        <component v-for="(render, index) in musicSearchResult ?? []" :index="index" :key="render.id"
          :is="render.component" v-bind="render.props" />
      </template>

    </ion-content>
  </ion-page>
</template>
