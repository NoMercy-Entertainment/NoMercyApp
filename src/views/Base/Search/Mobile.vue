<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonPage, IonContent, onIonViewWillEnter, IonInput, useKeyboard } from '@ionic/vue';

import { parseYear } from '@/lib/dateTime';
import { setColorPalette } from '@/store/ui';
import { videoSearchResult, videoSearchValue, hasMoreResults, fetchNextPage } from '@/store/search';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import { greetingValue } from '@/config/global';
import { showScreensaver } from "@/store/imageModal";

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
    document.body.focus();
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div :class="{
        'relative flex flex-grow flex-col items-center justify-start gap-12 self-stretch overflow-hidden px-4 pt-8 h-full will-change-auto': true,
        'mb-24': isOpen && videoSearchResult.length == 0,
      }">
        <CosmosBg2 v-if="greetingValue && videoSearchResult.length == 0" />
        <div v-if="greetingValue && videoSearchResult.length == 0"
          class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p
            class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left  text-slate-light-11 dark:text-slate-dark-11">
            {{ $t(`Good ${greetingValue}`) }}
          </p>
          <p class="flex-grow-0 flex-shrink-0 w-[333px] text-2xl text-center text-[#eff7ff]/[0.62]">
            {{ $t('What would you like to see?') }}
          </p>
        </div>

        <div class="absolute top-0 flex w-full flex-col gap-4 px-2 pt-2 h-full overflow-clip" :style="{
          height: isOpen && videoSearchResult.length == 0
            ? `calc(100vh - ${keyboardHeight + 100}px)`
            : isOpen && videoSearchResult.length > 0
              ? `calc(100vh - ${keyboardHeight + 70}px)`
              : '87%',
        }" :class="videoSearchResult.length > 0 ? '' : ''">
          <div class="flex flex-wrap gap-2 sm:gap-4 overflow-auto">
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
            <div class="z-50 mt-4 flex justify-center" ref="loadMore" v-if="hasMoreResults">
              <button @click="fetchNextPage()" class="h-12 rounded bg-blue-500 px-4 py-2 text-white">
                {{ $t('Load more') }}
              </button>
            </div>
          </div>
        </div>

        <div
          class="absolute flex flex-shrink-0 flex-grow-0 items-center justify-start overflow-hidden rounded-2xl border-2 mb-4 mx-4 bg-black transition-all duration-0 gap-5r border-auto-10 w-available"
          :style="{
            bottom: isOpen && videoSearchResult.length == 0
              ? `${keyboardHeight - 50}px`
              : isOpen && videoSearchResult.length > 0
                ? `${keyboardHeight - 50}px`
                : !isOpen && videoSearchResult.length > 0
                  ? '0vh'
                  : '50vh',
          }" :class="{
              'mx-6': !isOpen,
              'mb-6': isOpen,
            }">
          <label class="flex w-available">
            <ion-input enterkeyhint="search" id="search" placeholder="Search for a Movie, TV Show or Actor..."
              class="w-full flex-shrink-0 border-transparent bg-transparent text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none] !px-6 transition-all duration-150"
              :class="{
                '!py-2': !isOpen,
              }" v-model="videoSearchValue" name="search" type="search" ref="search" autocomplete="off" />
          </label>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
