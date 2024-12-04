<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {IonPage, IonContent, onIonViewWillEnter, IonInput, useKeyboard} from '@ionic/vue';

import {musicSearchResult, musicSearchValue} from '@/store/search';

import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import {setColorPalette} from '@/store/ui';
import {greetingValue} from '@/config/global';
import {showScreensaver} from "@/store/imageModal";

const { isOpen, keyboardHeight } = useKeyboard();

const search = ref();

onIonViewWillEnter(() => {
  setColorPalette(null);
});

onMounted(() => {
  setTimeout(() => {
    search.value.$el.setFocus();
  }, 100);
});

watch(showScreensaver, (value) => {
  if (value) {
    search.value.$el.sblur();
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-if="musicSearchResult"
          :class="{
              'relative flex flex-grow flex-col items-center justify-start gap-12 self-stretch overflow-hidden px-4 pt-8 rounded-2xl h-full will-change-auto': true,
               'mb-24': isOpen && musicSearchResult.length == 0,
             }"
      >
        <CosmosBg2 v-if="greetingValue && musicSearchResult.length == 0"/>
        <div v-if="greetingValue && musicSearchResult.length == 0" class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left  text-slate-light-11 dark:text-slate-dark-11">
            {{ $t('Good') }}
            <span class="" id="greeting">
              {{ greetingValue }}
            </span>
          </p>
          <p class="flex-grow-0 flex-shrink-0 w-[333px] text-2xl text-center text-[#eff7ff]/[0.62]">
            {{ $t('What would you like to listen to?') }}
          </p>
        </div>

        <div class="absolute top-0 flex w-full flex-col gap-4 px-2 pt-2 h-full overflow-clip"
             :style="{
                height: isOpen && musicSearchResult.length == 0
                  ? `calc(100vh - ${keyboardHeight + 100}px)`
                  : isOpen && musicSearchResult.length > 0
                    ? `calc(100vh - ${keyboardHeight + 90}px)`
                    : '87%',
             }"
             :class="musicSearchResult.length > 0 ? '' : ''">
          <div class="flex flex-col overflow-auto">

            <template v-if="musicSearchResult">
              <component
                  v-for="(render, index) in musicSearchResult ?? []"
                  :index="index"
                  :key="render.id"
                  :is="render.component"
                  v-bind="render.props"
              />
            </template>
          </div>
        </div>

        <div class="absolute flex flex-shrink-0 flex-grow-0 items-center justify-start overflow-hidden rounded-2xl border-2 mb-4 mx-4 bg-black transition-all duration-0 gap-5r border-auto-10 w-available"
             :style="{
                bottom: isOpen && musicSearchResult.length == 0
                  ? `${keyboardHeight - 20}px`
                  : isOpen && musicSearchResult.length > 0
                    ? `${keyboardHeight - 20}px`
                    :  !isOpen && musicSearchResult.length > 0
                      ? '0vh'
                      :'50vh',
             }"
             :class="{
                'mx-6': !isOpen,
                'mb-6': isOpen,
             }"
        >
          <label class="flex w-available">
            <ion-input
                enterkeyhint="search"
                id="search"
                placeholder="Search for an Artist, Album or track..."
                class="w-full flex-shrink-0 border-transparent bg-transparent text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none] !px-6 transition-all duration-150"
                :class="{
                          '!py-2': !isOpen,
                       }"
                v-model="musicSearchValue"
                name="search"
                type="search"
                ref="search"
                autocomplete="off"
            />
          </label>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>
