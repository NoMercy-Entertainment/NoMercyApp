<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch} from 'vue';
import {useRoute} from "vue-router";
import {IonPage, IonContent} from '@ionic/vue';

import {PersonResponseItem} from "@/types/api/base/person";

import {setBackground, setColorPalette} from '@/store/ui';
import {breakDescription, breakTitle, setTitle, unique} from "@/lib/stringArray";
import useServerClient from "@/lib/clients/useServerClient";
import {isNative} from "@/config/global";
import i18next from "@/config/i18next";
import {currentSong} from "@/store/audioPlayer";

import SpriteIcon from "@/components/Images/icons/SpriteIcon.vue";
import DropdownMenu from "@/Layout/Desktop/components/Menus/DropdownMenu.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import DropdownLink from "@/components/MusicPlayer/components/DropdownLink.vue";
import MediaCarousel from "@/components/Carousel/MediaCarousel.vue";
import CreditGroup from "@/components/MusicPlayer/components/CreditGroup.vue";
import FloatingPersonCard from "@/components/MusicPlayer/components/FloatingPersonCard.vue";
import ScrollContainer from "@/Layout/Desktop/components/ScrollContainer.vue";

const route = useRoute();
const {data} = useServerClient<PersonResponseItem>({
  queryKey: ['base', 'person', route.params.id],
});

const age = computed(() => {
  if (data.value?.deathday) {
    const birthDate = new Date(data.value?.birthday);
    const deathday = new Date(data.value?.deathday);
    const a = deathday.getFullYear() - birthDate.getFullYear();
    const m = deathday.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && deathday.getDate() < birthDate.getDate())) {
      return a - 1;
    }
    return a;
  }
  if (data.value?.birthday) {
    const birthDate = new Date(data.value?.birthday);
    const currentDate = new Date();
    const a = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      return a - 1;
    }
    return a;
  }
});

const gender = computed(() => {
  if (typeof data.value?.gender !== 'number') return data.value?.gender;

  switch (data.value?.gender) {
    case 0:
      return 'Not specified';
    case 1:
      return 'Female';
    case 2:
      return 'Male';
    case 3:
      return 'Non-binary';
    default:
      return null;
  }
});

watch(data, (value) => {
  setTitle(data?.value?.name);
  setBackground(value?.known_for?.at(0)?.backdrop ?? null);
});

onMounted(() => {
  setTitle(data?.value?.name);
  setColorPalette(null);
  setBackground(data?.value?.known_for?.at(0)?.backdrop ?? null);
});

onUnmounted(() => {
  setBackground(null);
  setColorPalette(null);
});

const filter = 'combined';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScrollContainer :autoHide="true" :static="true">
        <div v-if="data"
             :class="{
           'pb-24' : isNative && !currentSong,
           'pb-40' : isNative && currentSong,
           'children:pb-4 sm:children:pb-3' : !isNative && currentSong
        }"
             class="flex bg-black/50 w-available relative">
          <div
              class="relative mx-auto flex w-full flex-shrink-0 flex-grow-0 items-end justify-start gap-4 self-stretch rounded-lg p-4 max-w-screen-5xl">
            <div class="flex flex-grow flex-col items-end justify-start gap-2 pt-[290px] w-available">
              <div
                  :class="`flex w-full items-start justify-start self-stretch rounded-2xl pr-4 pl-52 gap-[280px]  bg-gradient-to-b from-auto-1/12 via-auto-1/12 to-auto-1/11 border-1 sm:py-2 sm:pl-64 2xl:pl-96 ${!!data?.deathday ? 'border-auto-12' : 'border-auto-12/4'}`">
                <div class="relative flex w-full flex-grow flex-col items-start justify-start gap-4">
                  <div
                      class="relative mt-8 -mb-2 flex flex-col justify-start self-stretch sm:mt-4 sm:items-center sm:gap-4 lg:flex-row">
                    <p :style="`font-size: min(calc(150px / ${data?.name?.length} + 3ch), 2rem)`"
                       class="mb-2 flex-grow text-5xl font-bold leading-[150%]">
                      {{ breakTitle(data?.name ?? '', 'text-base sm:text-xl -mt-2') }}
                    </p>
                    <div class="ml-auto flex w-full items-center justify-end gap-2"
                         style="width: 432px;">

                      <a :href="`https://www.themoviedb.org/person/${data?.id}`"
                         class="relative mr-2 flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="tmdb" class="!w-12"/>
                      </a>
                      <a v-if="data?.external_ids?.facebook_id"
                         :href="`https://www.facebook.com/${data?.external_ids.facebook_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="facebook" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.twitter_id"
                         :href="`https://twitter.com/${data?.external_ids?.twitter_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="twitter" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.instagram_id"
                         :href="`https://instagram.com/${data?.external_ids?.instagram_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="instagram" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.youtube_id"
                         :href="`https://youtube.com/channel/${data?.external_ids?.youtube_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="youtube" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.tiktok_id"
                         :href="`https://tiktok.com/@${data?.external_ids?.tiktok_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="tiktok" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.imdb_id"
                         :href="`https://www.imdb.com/name/${data?.external_ids?.imdb_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="imdb" class="w-6"/>
                      </a>
                      <a v-if="data?.external_ids?.wikidata_id"
                         :href="`https://www.wikidata.org/wiki/${data?.external_ids?.wikidata_id}`"
                         class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2"
                         target="_blank">
                        <SpriteIcon icon="wikipedia" class="w-6"/>
                      </a>
                      <DropdownMenu>
                        <template v-slot:button>
                          <div class="relative flex items-center justify-center overflow-hidden rounded-lg p-1.5 sm:p-2">
                            <MoooomIcon class="w-6 text-auto-12" icon="menuDotsVertical"/>
                          </div>
                        </template>

                        <DropdownLink target="_blank" :href="`https://www.themoviedb.org/person/${data.id}/edit`">
                          {{ $t('Edit on TMDb') }}
                        </DropdownLink>
                      </DropdownMenu>
                    </div>
                    <div class="mt-4 h-px self-stretch bg-white/10 sm:mt-0"></div>
                  </div>
                  <div class="relative flex flex-col items-start justify-start self-stretch py-4 sm:gap-4">
                    <div class="flex w-full flex-col flex-wrap items-start gap-6 sm:flex-row sm:gap-2">
                      <div
                          class="relative flex w-auto flex-col items-start justify-center gap-1 sm:w-[30%] lg:w-[15%] xl:w-[15%] 2xl:w-[11%]">
                        <p v-if="data?.known_for_department"
                           class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                          {{ $t('Known For') }}
                        </p>
                        <p class="text-left text-base font-medium text-contrast">
                          {{ data?.known_for_department }}
                        </p>
                      </div>
                      <div
                          class="relative flex w-auto flex-col items-start justify-center gap-1 sm:w-[39%] lg:w-[20%] xl:w-[20%] 2xl:w-[14%]">
                        <p v-if="data?.combined_credits?.cast"
                           class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                          {{ $t('Known Credits') }}
                        </p>
                        <p class="text-left text-base font-medium text-contrast">
                          {{ data?.combined_credits?.cast?.length }}
                        </p>
                      </div>
                      <div
                          class="relative flex w-auto flex-col items-start justify-start gap-1 sm:w-[25%] lg:w-[15%] xl:w-[9%]">
                        <p v-if="gender"
                           class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                          {{ $t('Gender') }}
                        </p>
                        <p class="text-left text-base font-medium text-contrast">
                          {{ gender }}
                        </p>
                      </div>
                      <div
                          class="relative flex w-full flex-col items-start justify-center gap-1 lg:w-auto 2xl:w-[23%]">
                        <p v-if="age"
                           class="flex w-full flex-shrink-0 flex-grow-0 gap-2 text-xs font-bold uppercase text-auto-alpha-10">
                          {{ $t('Birthday') }}
                          <span v-if="data.deathday"
                                class="mr-8 ml-auto flex flex-shrink-0 flex-grow-0 gap-2 text-xs font-bold uppercase text-auto-alpha-10">
                      <span v-if="data.deathday"
                            class="-mr-1 text-base -mt-[3px]">&#8224;</span>
                      {{
                              new Date(data?.deathday!).toLocaleDateString(i18next.language ?? 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                              })
                            }}
                    </span>
                        </p>
                        <p v-if="age"
                           class="text-left text-base font-medium text-contrast">{{
                            new Date(data?.birthday!).toLocaleDateString(i18next.language ?? 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            })
                          }} ({{ age }}
                          {{ $t('years old') }})
                        </p>
                      </div>
                      <div
                          class="relative flex w-full flex-col items-start justify-start gap-1 lg:w-auto xl:flex-grow">
                        <p v-if="data?.place_of_birth"
                           class="flex-shrink-0 flex-grow-0 self-stretch text-xs font-bold uppercase text-auto-alpha-10">
                          {{ $t('Place of Birth') }}
                        </p>
                        <p
                            class="w-full self-stretch whitespace-pre-wrap text-base font-medium text-contrast">
                          {{ data?.place_of_birth }}
                        </p>
                      </div>
                    </div>
                    <div class="mt-4 h-px self-stretch bg-white/10 sm:mt-0"></div>
                  </div>
                  <div class="relative flex w-full flex-col items-start justify-start gap-2">
                    <p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-auto-alpha-10">
                      {{ $t('Biography') }}
                    </p>
                    <p v-if="data?.biography"
                       class="self-stretch whitespace-pre-line text-base font-medium text-contrast leading-[173%]">
                      {{ breakDescription(data?.biography) }}
                    </p>
                  </div>
                  <div class="mb-8 -ml-1 w-[101.5%]">
                    <div class="-ml-5 w-[100.6%]">
                      <MediaCarousel v-if="data?.known_for && data?.known_for?.length > 0"
                                     :color-palette="data?.color_palette"
                                     :data="unique(data.known_for, 'id')"
                                     :limitCardCountBy="2"
                                     title="Known for"
                                     :disableAutoAspect="true"
                                     type="poster"/>
                    </div>
                  </div>

                  <CreditGroup :items="data?.[`${filter}_credits`]?.cast"
                               title="Acting"/>
                  <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Produc'))"
                               title="Production"/>
                  <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Writ'))"
                               title="Writing"/>
                  <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Direct'))"
                               title="Directing"/>
                  <CreditGroup
                      :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => !c.job.includes('Produc') && !c.job.includes('Writ') && !c.job.includes('Direct') && !c.job.includes('Creator'))"
                      title="Crew"/>
                  <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Creator'))"
                               title="Creator"/>

                </div>
              </div>
            </div>
            <FloatingPersonCard :data="data"/>
          </div>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
