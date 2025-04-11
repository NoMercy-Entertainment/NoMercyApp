<script setup lang="ts">
import {onMounted} from 'vue';
import {IonPage, IonContent, onIonViewWillEnter} from '@ionic/vue';
import {useRoute} from "vue-router";

import {parseYear} from '@/lib/dateTime';
import {setBackground, setColorPalette} from '@/store/ui';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import {
  search,
  searchValue,
  searchType,
  hasMoreResults,
  fetchNextPage,
  musicSearchResult,
  videoSearchResult,
} from '@/store/search';

import {greetingValue} from '@/config/global';

const route = useRoute();

onIonViewWillEnter(() => {
  searchType.value = route.query.from == 'music' ? 'music' : 'video';
  setColorPalette(null);
  setBackground(null);
  setTimeout(() => {
    search.value.focus();
  }, 100);
});

onMounted(() => {
  searchType.value = route.query.from == 'music' ? 'music' : 'video';
  setColorPalette(null);
  setBackground(null);
  setTimeout(() => {
    search.value.focus();
  }, 100);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
           :class="{
            'w-available relative flex flex-col items-center gap-10 m-3 overflow-clip rounded-2xl transform-all duration-300 will-change-auto min-w-available': true,
            'h-24 min-h-24 ': searchValue?.length > 0,
            'h-[460px] min-h-[460px] ': searchValue?.length == 0
          }"
      >
        <CosmosBg2/>

        <div v-if="greetingValue && searchValue?.length == 0"
             class="relative z-10 mt-12 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p class="flex-shrink-0 flex-grow-0 text-7xl font-black">
            {{ $t(`Good ${greetingValue}`) }}
          </p>
          <p class="flex-shrink-0 flex-grow-0 text-3xl font-medium">
            {{
              searchType == 'video'
                  ? $t('What would you like to see?')
                  : $t('What would you like to listen to?')
            }}
          </p>
        </div>

        <div
            class="flex justify-center items-center self-center flex-grow-0 flex-shrink-0 w-full sm:w-1/2 relative overflow-hidden gap-5 p-2 rounded-[20px] border-2 bg-[#d7dbdf] border-[#eceef0] dark:bg-black dark:border-[#202425]"
            :class="{
              'mb-auto' : searchValue?.length == 0,
              'my-auto' : searchValue?.length > 0,
            }">
          <div
              class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 p-1 rounded-xl bg-[#012139]/[0.13] dark:bg-[#dfeffe]/[0.14] backdrop-blur"
          >
            <div class="relative flex justify-center items-start flex-grow-0 flex-shrink-0 gap-2">
              <div class="absolute w-[117px] h-available inset-0 bg-focus z-0 rounded-lg transition-all duration-150"
                   :class="{
                      'translate-x-0': searchType == 'video',
                      'translate-x-[107%]': searchType == 'music',
                    }"
              ></div>
              <button @click="searchType = 'video'"
                      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 pl-3 pr-4 py-3 rounded-lg w-[117px]"
                      :class="{
                         'text-slate-dark-12': searchType == 'video',
                      }"
              >
                <MoooomIcon icon="film" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
                <p class="hidden sm:flex flex-grow-0 flex-shrink-0 text-xl font-semibold text-left transition-all duration-150">
                  {{ $t('Video') }}
                </p>
              </button>
              <button @click="searchType = 'music'"
                      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 pl-3 pr-4 py-3 rounded-lg w-[117px]"
                      :class="{
                         'text-slate-dark-12': searchType == 'music',
                      }"
              >
                <MoooomIcon icon="noteDouble" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
                <p class="hidden sm:flex flex-grow-0 flex-shrink-0 text-xl font-semibold text-left transition-all duration-150">
                  {{ $t('Music') }}
                </p>
              </button>
            </div>
          </div>

          <label class="flex w-available">
            <input id="search"
                   :placeholder="searchType == 'video'
                              ? 'Search for a Movie, TV Show or Person...'
                              : 'Search for an Artist, Album or Track...'"
                 class="w-available flex-shrink-0 border-transparent bg-transparent px-2 py-1 mr-2 text-2xl shadow-transparent flex-grow-1
                   focus: outline-none"
                   v-model="searchValue" name="search" type="search" ref="search" autocomplete="off"/>
          </label>
        </div>
      </div>

      <div v-if="searchType == 'video'"
           class="flex w-full flex-col gap-4 p-1 h-available sm:p-4 sm:pt-0 overflow-auto"
           :class="videoSearchResult && videoSearchResult.length > 0 ? 'mt-4' : ''">
        <div class="flex flex-wrap gap-2 pb-3 sm:gap-4">
          <template v-for="item in videoSearchResult ?? []" :key="item.id">

            <RouterLink :to="`/${item.media_type}/${item.id}`"
                        class="relative flex w-full gap-4 overflow-hidden rounded-lg bg-zinc-900 p-2 sm:w-[32.67%]">
              <img v-if="item?.backdrop_path" :src="'https://image.tmdb.org/t/p/original' + item?.backdrop_path"
                   :alt="item?.title" class="absolute inset-0 h-full w-full object-cover"/>

              <div
                  class="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-black via-black/75 to-black/40 from-25%">
              </div>

              <div class="relative z-20 h-auto w-1/4 overflow-clip rounded-sm aspect-poster bg-auto-1 sm:w-1/4">
                <img v-if="item?.poster_path || item?.profile_path"
                     :src="'https://image.tmdb.org/t/p/original' + (item?.poster_path ?? item?.profile_path)"
                     :alt="item?.title" class="absolute inset-0 h-auto w-full object-cover"/>
                <AppLogoSquare v-else class="absolute inset-0 top-2 z-20 m-auto h-16 w-16"/>
              </div>

              <div class="relative z-20 flex h-full w-px flex-1 flex-col items-start justify-start gap-1">
                <p class="flex-shrink-0 flex-grow-0 self-stretch text-left text-xl font-semibold line-clamp-1">
                  {{ item?.name || item?.title }}
                </p>
                <div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch">
                  <p class="flex flex-shrink-0 flex-grow-0 items-center gap-2 text-right text-base">
                    <MoooomIcon v-if="item?.media_type === 'tv'" icon="monitor" className="h-5 w-5 sm:h-4 sm:w-4"/>
                    <MoooomIcon v-else-if="item?.media_type === 'movie'" icon="film"
                                className="h-5 w-5 sm:h-4 sm:w-4"/>
                    <MoooomIcon v-else-if="item?.media_type === 'person'" icon="user"
                                className="h-5 w-5 sm:h-4 sm:w-4"/>
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
      </div>
      <div v-else-if="musicSearchResult"
           class="flex w-full flex-col p-1 h-available sm:p-4 sm:pt-0 overflow-auto"
           :class="musicSearchResult && musicSearchResult.length > 0 ? 'mt-4' : ''">
        <component v-for="(render, index) in musicSearchResult ?? []" :index="index" :key="render.id"
                   :is="render.component" v-bind="render.props" />
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