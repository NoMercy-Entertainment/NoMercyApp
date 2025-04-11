<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import { IonPage, IonContent, onIonViewWillEnter, useKeyboard } from '@ionic/vue';
import {useRoute} from "vue-router";

import { parseYear } from '@/lib/dateTime';
import {setBackground, setColorPalette} from '@/store/ui';
import {
  search,
  searchValue,
  searchType,
  hasMoreResults,
  fetchNextPage,
  musicSearchResult,
  videoSearchResult,
  displayResults, videoSearchValue,
} from '@/store/search';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import { greetingValue } from '@/config/global';
import { showScreensaver } from "@/store/imageModal";
import {refDebounced} from "@vueuse/core";

const route = useRoute();
const content = ref<VueDivElement>();

onIonViewWillEnter(() => {
  searchType.value = route.query.from == 'music' ? 'music' : 'video';
  setColorPalette(null);
  setBackground(null);
  setTimeout(() => {
    search.value.focus();
    // @ts-ignore
    content.value?.$el?.scrollToBottom();
  }, 100);
});

onMounted(() => {
  searchType.value = route.query.from == 'music' ? 'music' : 'video';
  setColorPalette(null);
  setBackground(null);
  setTimeout(() => {
    search.value.focus();
    // @ts-ignore
    content.value?.$el?.scrollToBottom();
  }, 100);
});

const { isOpen, keyboardHeight } = useKeyboard();
const debouncedIsOpen = refDebounced(isOpen, 300);
const debouncedKeyboardHeight = refDebounced(keyboardHeight, 300);

onIonViewWillEnter(() => {
  setColorPalette(null);
  setBackground(null);
});

onMounted(() => {
  setTimeout(() => {
    search.value.focus();
    // @ts-ignore
    content.value?.$el?.scrollToBottom();
  }, 100);
});

watch(showScreensaver, (value) => {
  if (value) {
    document.body.focus();
  }
});

watch(searchType, () => {
  setTimeout(() => {
    if(searchValue.value?.length == 0) {
      search.value.focus();
    }
    // @ts-ignore
    content.value?.$el?.scrollToBottom();
  }, 100);
});

watch(debouncedKeyboardHeight, () => {
  setTimeout(() => {
    // @ts-ignore
    content.value?.$el?.scrollToBottom(0);
  }, 100);
});

</script>

<template>
  <ion-page >
    <ion-content :fullscreen="true" ref="content">
      <div :class="{
        'flex flex-grow flex-col items-center justify-start gap-12 self-stretch overflow-clip px-4 pt-8 will-change-auto': true,
        'mb-24': debouncedIsOpen && searchValue?.length == 0,
      }">
        <CosmosBg2 v-if="greetingValue && searchValue?.length == 0" class="!h-[90vh]" />
        <div v-if="greetingValue && searchValue?.length == 0"
          class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p
            class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left  text-slate-light-11 dark:text-slate-dark-11">
            {{ $t(`Good ${greetingValue}`) }}
          </p>
          <p class="flex-grow-0 flex-shrink-0 w-[333px] text-2xl text-center text-[#eff7ff]/[0.62]">
            {{
              searchType == 'video'
                  ? $t('What would you like to see?')
                  : $t('What would you like to listen to?')
            }}
          </p>
        </div>

        <div class="absolute top-0 flex w-full flex-col gap-4 px-2 pt-2 h-full overflow-clip" :style="{
          height: debouncedIsOpen && searchValue?.length == 0
            ? `calc(100vh - ${debouncedKeyboardHeight + 100}px)`
            : debouncedIsOpen && searchValue?.length > 0
              ? `calc(100vh - ${debouncedKeyboardHeight + 70}px)`
              : '92%',
        }" :class="searchValue?.length > 0 ? '' : ''">

          <div v-if="searchType == 'video'" class="flex flex-wrap gap-2 sm:gap-4 overflow-auto">
            <template v-for="item in videoSearchResult ?? []" :key="item.id">

              <RouterLink :to="`/${item.media_type}/${item.id}`"
                class="relative flex w-full gap-4 overflow-hidden rounded-lg bg-zinc-900 p-2 sm:w-[32.67%]">
                <img v-if="item?.backdrop_path" :src="'https://image.tmdb.org/t/p/original' + item?.backdrop_path"
                  :alt="item?.title" class="absolute inset-0 h-full w-full object-cover" />

                <div
                  class="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-black via-black/75 to-black/40 from-25%">
                </div>

                <div class="relative z-20 h-auto w-1/4 overflow-clip rounded-sm aspect-poster bg-auto-1 sm:w-1/4">
                  <img v-if="item?.poster_path || item?.profile_path"
                    :src="'https://image.tmdb.org/t/p/original' + (item?.poster_path ?? item?.profile_path)"
                    :alt="item?.title" class="absolute inset-0 h-auto w-full object-cover" />
                  <AppLogoSquare v-else class="absolute inset-0 top-2 z-20 m-auto h-16 w-16" />
                </div>

                <div class="relative z-20 flex h-full w-px flex-1 flex-col items-start justify-start gap-1">
                  <p class="flex-shrink-0 flex-grow-0 self-stretch text-left text-xl font-semibold line-clamp-1">
                    {{ item?.name || item?.title }}
                  </p>
                  <div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch">
                    <p class="flex flex-shrink-0 flex-grow-0 items-center gap-2 text-right text-base">
                      <MoooomIcon v-if="item?.media_type === 'tv'" icon="monitor" className="h-5 w-5 sm:h-4 sm:w-4" />
                      <MoooomIcon v-else-if="item?.media_type === 'movie'" icon="film"
                        className="h-5 w-5 sm:h-4 sm:w-4" />
                      <MoooomIcon v-else-if="item?.media_type === 'person'" icon="user"
                        className="h-5 w-5 sm:h-4 sm:w-4" />
                      <span v-if="item?.release_date || item?.first_air_date" class="sm:text-2xs">
                        ({{ parseYear(item?.release_date ?? item?.first_air_date) }})
                      </span>
                    </p>
                  </div>
                  <p class="text-sm line-clamp-[4] sm:text-2xs sm:line-clamp-4">
                    {{ item?.overview }}
                  </p>
                </div>
              </RouterLink>

            </template>
            <div class="z-50 mt-4 flex justify-center" ref="loadMore" v-if="hasMoreResults && videoSearchResult.length > 0">
              <button @click="fetchNextPage()" class="h-12 rounded bg-blue-500 px-4 py-2 text-white">
                {{ $t('Load more') }}
              </button>
            </div>
          </div>

          <div v-else-if="musicSearchResult"
               class="flex w-full flex-col p-1 h-available sm:p-4 sm:pt-0 overflow-auto">
            <component v-for="(render, index) in musicSearchResult ?? []" :index="index" :key="render.id"
                       :is="render.component" v-bind="render.props" />
          </div>
        </div>

        <div
          class="absolute flex justify-center items-center self-center flex-grow-0 flex-shrink-0 w-available h-14 sm:w-1/2 overflow-hidden gap-2 p-1.5 rounded-[20px] border-2 bg-[#d7dbdf] border-[#eceef0] dark:bg-black dark:border-[#202425] transition-all duration-300"
          :style="{
            bottom: debouncedIsOpen && searchValue.length == 0
              ? `${debouncedKeyboardHeight - 80}px`
              : debouncedIsOpen && searchValue.length > 0
                ? `${debouncedKeyboardHeight - 80}px`
                : !debouncedIsOpen && searchValue.length > 0
                  ? '0vh'
                  : '50vh',
          }" :class="{
              'mx-2': !debouncedIsOpen && searchValue.length == 0,
              'rounded-none': debouncedIsOpen || searchValue.length > 0,
            }">

          <div
              class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 p-1 rounded-xl bg-[#012139]/[0.13] dark:bg-[#dfeffe]/[0.14] backdrop-blur"
          >
            <div class="relative flex justify-center items-start flex-grow-0 flex-shrink-0 gap-2">
              <div class="absolute w-9 h-available inset-0 bg-focus z-0 rounded-lg transition-all duration-150"
                   :class="{
                      'translate-x-0': searchType == 'video',
                      'translate-x-[120%]': searchType == 'music',
                    }"
              ></div>
              <button @click="searchType = 'video'"
                      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9"
                      :class="{
                         'text-slate-dark-12': searchType == 'video',
                      }"
              >
                <MoooomIcon icon="film" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
              </button>
              <button @click="searchType = 'music'"
                      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9"
                      :class="{
                         'text-slate-dark-12': searchType == 'music',
                      }"
              >
                <MoooomIcon icon="noteDouble" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
              </button>
            </div>
          </div>

          <label class="flex w-available">
            <input enterkeyhint="search" id="search"
                       :placeholder="searchType == 'video'
                              ? 'Movie, TV Show or Person...'
                              : 'Artist, Album or Track...'"

              class="w-available flex-shrink-0 border-transparent bg-transparent mr-1 text-lg shadow-transparent flex-grow-1
                   focus: outline-none"
              :class="{
                '!py-1': !debouncedIsOpen,
              }" v-model="searchValue" name="search" type="search" ref="search" autocomplete="off" />
          </label>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
