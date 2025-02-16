<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonContent, onIonViewWillEnter } from '@ionic/vue';

import { parseYear } from '@/lib/dateTime';
import { setColorPalette } from '@/store/ui';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import { videoSearchResult, videoSearchValue, hasMoreResults, fetchNextPage, musicSearchResult } from '@/store/search';
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
        'w-available relative flex flex-col items-center gap-12 m-3 overflow-clip rounded-2xl transform-all duration-300 will-change-auto min-w-available': true,
        'h-24 min-h-24 ': videoSearchResult.length > 0,
        'h-[460px] min-h-[260px] ': videoSearchResult.length == 0
      }">
        <CosmosBg2 />
        <div v-if="greetingValue && videoSearchResult.length == 0"
          class="relative z-10 mt-8 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p class="flex-shrink-0 flex-grow-0 text-7xl font-black">
            {{ $t(`Good ${greetingValue}`) }}
          </p>
          <p class="flex-shrink-0 flex-grow-0 text-3xl font-medium">
            {{ $t('What would you like to see?') }}
          </p>
        </div>
        <div
          class="relative my-auto flex w-full flex-shrink-0 flex-grow-0 items-center justify-start gap-5 self-center overflow-hidden rounded-2xl border-2 bg-black border-auto-10 sm:w-5/6 focus-within:border-white"
          :class="{
            'mb-16': !videoSearchResult || videoSearchResult.length == 0
          }">
          <label class="flex w-available">
            <input id="search" placeholder="Search for a Movie, TV Show or Actor..."
              class="w-full flex-shrink-0 border-transparent bg-transparent px-6 py-4 text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none]"
              v-model="videoSearchValue" name="search" type="search" ref="search" autocomplete="off" />
          </label>
        </div>
      </div>

      <div class="flex w-full flex-col gap-4 p-1 h-available sm:p-4 overflow-auto"
        :class="videoSearchResult && videoSearchResult.length > 0 ? 'mt-4' : ''">
        <div class="flex flex-wrap gap-2 pb-3 sm:gap-4">
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
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content::part(scroll) {
  display: flex;
  flex-direction: column;
  @apply h-available overflow-clip;
}
</style>