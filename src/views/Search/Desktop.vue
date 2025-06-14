<script setup lang="ts">
import {onMounted, watch} from 'vue';
import {IonPage, IonContent, onIonViewWillEnter} from '@ionic/vue';
import {useRoute} from "vue-router";

import {setBackground, setColorPalette} from '@/store/ui';

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

import ScrollContainer from "@/Layout/Desktop/components/ScrollContainer.vue";
import SearchCard from "@/components/Cards/SearchCard.vue";
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';

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

watch(searchType, () => {
  setTimeout(() => {
    if(searchValue.value?.length == 0) {
      search.value.focus();
    }
  }, 100);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
          :class="{
            'w-available relative flex flex-col items-center gap-10 m-3 overflow-clip rounded-lg transform-all duration-200 will-change-auto min-w-available': true,
            'h-24 min-h-24 ': searchValue?.length > 0,
            'h-[480px] min-h-[480px] ': searchValue?.length == 0
          }"
      >
        <CosmosBg2/>

        <div v-if="greetingValue && searchValue?.length == 0"
             class="relative z-10 mt-12 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
          <p class="flex-shrink-0 flex-grow-0 text-7xl font-black">
            {{ $t(`Good ${greetingValue}`) }}!
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
            class="flex justify-center items-center self-center flex-grow-0 flex-shrink-0 w-full sm:w-1/2 relative overflow-hidden gap-4 p-2 pr-0 rounded-[20px] border-2 bg-[#d7dbdf] border-[#eceef0] dark:bg-black dark:border-[#202425]"
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
                <OptimizedIcon icon="film" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
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
                <OptimizedIcon icon="noteDouble" class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"/>
                <p class="hidden sm:flex flex-grow-0 flex-shrink-0 text-xl font-semibold text-left transition-all duration-150">
                  {{ $t('Music') }}
                </p>
              </button>
            </div>
          </div>

          <label class="flex w-available mr-1">
            <input id="search"
                   :placeholder="searchType == 'video'
                              ? `${$t('Movie')}, ${$t('Show')} ${$t('or')} ${$t('Person')}...`
                              : `${$t('Artist')}, ${$t('Album')} ${$t('or')} ${$t('Track')}...`"
                   class="w-available flex-shrink-0 border-transparent bg-transparent px-2 py-1 text-2xl shadow-transparent flex-grow-1
                   focus: outline-none"
                   v-model="searchValue" name="search" type="search" ref="search" autocomplete="off"/>
          </label>
        </div>
      </div>

      <div v-if="searchType == 'video' && videoSearchResult.length > 0"
           class="flex w-full flex-col gap-4 p-1 h-available overflow-hidden sm:px-4 sm:py-0">

        <div class="grid grid-cols-3 gap-2 sm:gap-4 h-min overflow-hidden">
          <template v-for="type in ['movie', 'tv', 'person']" :key="type">

            <div class="relative flex flex-col gap-2 sm:gap-4 h-available overflow-hidden">

              <p class="flex-shrink-0 flex-grow-0 text-2xl font-semibold text-left">
                {{ $t(type.replace('tv', 'show').toTitleCase()) }}
              </p>

              <div class="relative h-available overflow-hidden -mt-2">
                <ScrollContainer :static="false">
                  <div class="flex flex-col gap-2 sm:gap-4 h-min mr-6 mt-2">
                    <template v-for="item in (videoSearchResult ?? []).filter(r => r.media_type == type)"
                              :key="item.id">
                      <SearchCard :item="item" />
                    </template>
                  </div>

                  <div class="z-50 flex justify-center mt-3" ref="loadMore"
                       v-if="hasMoreResults && videoSearchResult.length > 0">
                    <button @click="fetchNextPage()" class="h-12 rounded bg-focus px-4 py-2 text-white">
                      {{ $t('Load more') }}
                    </button>
                  </div>
                </ScrollContainer>
              </div>
            </div>
          </template>
        </div>
        <!--        <div class="z-50 flex justify-center mb-4" ref="loadMore" v-if="hasMoreResults && videoSearchResult.length > 0">-->
        <!--          <button @click="fetchNextPage()" class="h-12 rounded bg-focus px-4 py-2 text-white">-->
        <!--            {{ $t('Load more') }}-->
        <!--          </button>-->
        <!--        </div>-->
      </div>
      <div v-else-if="musicSearchResult"
           class="flex w-full flex-col p-1 h-available sm:p-4 sm:pt-0 overflow-auto">
        <component v-for="(render, index) in musicSearchResult ?? []" :index="index" :key="render.id"
                   :is="render.component" v-bind="render.props"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content::part(scroll) {
  display: flex;
  flex-direction: column;
  @apply h-available overflow-hidden;
}
</style>