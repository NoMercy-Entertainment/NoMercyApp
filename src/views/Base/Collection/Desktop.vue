<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonContent} from '@ionic/vue';
import collect from 'collect.js';

import type {CollectionResponse} from '@/types/api/base/collection';

import i18next from '@/config/i18next';
import useServerClient from '@/lib/clients/useServerClient';
import {setBackground, setColorPalette} from '@/store/ui';
import {setTitle, sortByPosterAlphabetized, unique} from '@/lib/stringArray';
import {convertToHumanReact, humanTimeExtended} from '@/lib/dateTime';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import GenrePill from '@/components/Buttons/GenrePill.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import {showBackdrops} from '@/store/preferences';
import MediaCard from '@/components/Cards/MediaCard.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import {useTranslation} from 'i18next-vue';

const {t} = useTranslation();
const router = useRouter();

const { data } = useServerClient<CollectionResponse>({
  queryKey: ['base', 'collection', router.currentRoute.value.params.id],
  limit: 1000,
  keepForever: true,
});

const endTime = ref<string | 0 | null | undefined>(null);
const interval = ref<NodeJS.Timeout | null>(null);

watch(data, (value) => {
  if (!value) return;

  if (value?.backdrop) {
    setBackground(value?.backdrop);
  }
  if (value?.color_palette) {
    setColorPalette(value.color_palette.backdrop);
  }

  endTime.value = value.duration && new Date(new Date().getTime() + (value.duration * 60 * 1000)).toLocaleTimeString(i18next.language ?? 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  interval.value = setInterval(() => {
    endTime.value = value.duration && new Date(new Date().getTime() + (value.duration * 60 * 1000)).toLocaleTimeString(i18next.language ?? 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, 1000);

});

onMounted(() => {
  document.dispatchEvent(new Event('sidebar'));
  setTitle(data?.value?.title);

  if (data?.value?.backdrop) {
    setBackground(data?.value?.backdrop);
  }
  if (data?.value?.color_palette) {
    setColorPalette(data?.value?.color_palette.backdrop);
  }
});

onUnmounted(() => {
  setBackground(null);
  setColorPalette(null);

  clearInterval(interval.value ?? undefined);
});


</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScrollContainer :static="true" :auto-hide="true">

        <div class="w-available">
          <FloatingBackButton />
          <div v-if="data" class="w-available overflow-x-clip relative mt-12 flex flex-grow flex-col items-start justify-start gap-4 self-stretch p-4 pr-0 pb-5">
            <p class="ml-4 w-full flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold">
              {{ data?.title?.replace(/(: | en de )/, '\n') }}
            </p>
            <p class="ml-4 w-full flex-shrink-0 flex-grow-0 self-stretch text-lg">
              {{ data?.overview }}
            </p>
            <div class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch">
              <div
                  class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch">
                <div class="self-stretch h-px bg-[#e2f0fd]/4"></div>
                <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-8 self-stretch pl-4">
                  <div class="relative flex h-14 items-center justify-center gap-2">
                    <ContentRating :size="8" class="h-full min-!h-[1rem] object-scale-down" :ratings="data?.content_ratings" />
                  </div>
                  <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1">
                    <p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                      {{ $t('Contains') }}
                    </p>
                    <p class="flex-shrink-0 flex-grow-0 font-medium">
                      {{ data?.have_items }} / {{ data?.number_of_items }}
                    </p>
                  </div>
                  <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1">
                    <p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                      {{ $t('Timespan') }}
                    </p>
                    <p class="flex-shrink-0 flex-grow-0 font-medium">
                      {{ collect(data?.collection).min('year') }}
                      - {{ collect(data?.collection).max('year') }}
                    </p>
                  </div>
                  <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1">
                    <p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                      {{ $t('Total duration') }}
                    </p>
                    <p class="flex-shrink-0 flex-grow-0 font-medium">
                      {{ convertToHumanReact(t, data?.total_duration) }}
                    </p>
                  </div>
                  <div class="relative flex flex-grow flex-col items-start justify-center text-left gap-1">
                    <p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                      {{ $t('Genre') }}
                    </p>
                    <div class="flex flex-shrink-0 flex-grow-0 flex-wrap self-stretch overflow-clip font-medium gap-0.5"
                         :class="data?.genres?.length > 5 ? 'children:grayscale' : ''"
                    >
                      <template v-for="genre in data?.genres" :key="genre.id">
                        <GenrePill :genre="genre" />
                      </template>
                    </div>
                  </div>

                  <div class="relative ml-auto flex h-16 flex-shrink-0 flex-grow-0 items-center justify-center gap-4" v-if="data">

                    <RouterLink
                        :to="`/${data?.media_type}/${data?.id}/watch`"
                        class="relative flex items-center justify-center gap-2 rounded-lg p-2 transition-colors duration-300 group/play hover:bg-auto-5/6">
                      <MoooomIcon icon="play" className="w-6"/>

                      <div
                          class="absolute top-3 grid h-0 w-max flex-shrink-0 flex-grow-0 origin-bottom group-hover/play:grid-cols-1 items-center justify-start bg-black duration-300 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all left-[-31px] group-hover/play:top-[-38px] rounded-[5.46px]">
                        <div class="overflow-hidden">
                          <p class="flex-shrink-0 flex-grow-0 py-0 text-xs font-bold px-2.5">
                            {{ $t('Ends at') }}
                            {{ endTime }}
                          </p>
                        </div>
                      </div>
                    </RouterLink>

                    <!--                            <button-->
                    <!--                                class="relative flex items-center justify-center gap-2 overflow-hidden rounded-lg p-2 transition-colors duration-300 hover:bg-auto-5/6"-->
                    <!--                            >-->
                    <!--                                <MoooomIcon icon="film" className="w-6"/>-->
                    <!--                            </button>-->
                    <!--                            <button-->
                    <!--                                class="relative flex items-center justify-center gap-2 overflow-hidden rounded-lg p-2 transition-colors duration-300 hover:bg-auto-5/6"-->
                    <!--                            >-->
                    <!--                                <MoooomIcon icon="check" className="w-6"/>-->
                    <!--                            </button>-->

                    <MediaLikeButton div v-if="data" :data="data"/>

                    <DropdownMenu
                        class="relative flex items-center justify-center gap-2 overflow-hidden rounded-lg p-2 transition-colors duration-300 hover:bg-auto-5/6">
                      >
                      <template v-slot:button>
                        <MoooomIcon icon="menuDotsVertical" className="w-6"/>
                      </template>

                      <div class="flex w-full flex-col items-start justify-start bg-auto-1"
                           style="box-shadow: 0 4px 7px 0 rgba(0,0,0,0.08);">
                        <div
                            class="relative flex h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start gap-2 self-stretch z-1099 group">
                          <div class="flex flex-col p-2">

                          </div>
                        </div>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
                <div class="self-stretch h-px bg-[#e2f0fd]/4"></div>
              </div>
            </div>

            <div class="flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch px-4"
                 :class="showBackdrops ? 'media-backdrop-grid' : 'media-poster-grid'">
              <template v-for="movie in data?.collection ?? []" :key="movie?.id">
                <MediaCard :data="movie"  class="" />
              </template>
            </div>

            <PersonCarousel v-if="data?.cast && data?.cast?.length > 0"
                            :data="unique(data?.cast, 'id').slice(0, 50)"
                            title="Cast"/>

            <PersonCarousel v-if="data?.crew && data?.crew?.length > 0"
                            :data="sortByPosterAlphabetized(data?.crew).slice(0, 50)"
                            title="Crew"/>

            <ImageCarousel v-if="data?.posters && data?.posters?.length > 0"
                           :data="data?.posters"
                           title="Poster"
                           type="poster"/>

            <ImageCarousel v-if="data?.backdrops && data?.backdrops?.length > 0"
                           :color-palette="data?.color_palette?.poster"
                           :data="data?.backdrops"
                           title="Backdrop"
                           type="backdrop"/>


          </div>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
