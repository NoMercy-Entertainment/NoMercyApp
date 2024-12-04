<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {IonContent, IonPage, IonSkeletonText, onIonViewWillEnter, onIonViewWillLeave} from '@ionic/vue';

import type {InfoResponse} from '@/types/api/base/info';

import {tmdbImageBaseUrl} from '@/config/config';
import useServerClient from '@/lib/clients/useServerClient';
import {breakTitle2, setTitle, sortByPosterAlphabetized} from '@/lib/stringArray';
import {background, poster, setBackground, setColorPalette, setLogo, setPoster} from '@/store/ui';
import router from '@/router';

import NavBar from '@/Layout/Mobile/components/NavBar.vue';
import InfoItem from '@/views/Base/Info/components/InfoItem.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import MediaLikeButton from "@/components/Buttons/MediaLikeButton.vue";

const route = useRoute();
const enabled = ref(false);
const showMore = ref(false);
const trailerOpen = ref(false);

const content = ref<VueDivElement>();
const backgroundUrl = computed(() => {
  return `${tmdbImageBaseUrl}/original${background.value}`;
  // return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

const {data} = useServerClient<InfoResponse>({
  keepForever: true,
  path: route?.fullPath,
});

const {data: hasItem} = useServerClient<{ available: boolean; server: string; }>({
  path: `${route?.fullPath}/available`,
  enabled
});

watch(data, (value) => {
  content.value?.$el?.scrollToTop(window.innerHeight);
  enabled.value = true;

  setTitle(value?.title ?? value?.name);

  if (value?.backdrop) {
    setBackground(value?.backdrop);
  }
  if (value?.poster) {
    setPoster(value?.poster);
  }
  if (value?.logo) {
    setLogo(value?.logo);
  }
  if (value?.color_palette?.backdrop) {
    setColorPalette(value?.color_palette?.backdrop);
  }
});

onIonViewWillEnter(() => {
  content.value?.$el?.scrollToTop(window.innerHeight);
  // trailerIndex.value = 0;
  setTitle(data?.value?.name);

  if (data?.value?.backdrop) {
    setBackground(data?.value?.backdrop);
  }
  if (data?.value?.poster) {
    setPoster(data?.value?.poster);
  }
  if (data?.value?.logo) {
    setLogo(data?.value?.logo);
  }
  if (data?.value?.color_palette?.backdrop) {
    setColorPalette(data?.value?.color_palette?.backdrop);
  }
});

onIonViewWillLeave(() => {
  content.value?.$el?.scrollToTop(window.innerHeight);
});

router.afterEach(() => {
  setTimeout(() => {
    content.value?.$el?.scrollToTop(window.innerHeight);
  }, 100);
});

const overview = ref<VueDivElement>();

watch(showMore, (value) => {
  if (value) {
    overview.value?.$el?.classList.remove('line-clamp-3');
  } else {
    setTimeout(() => {
      overview.value?.$el?.classList.add('line-clamp-3');
    }, 300);
  }
});

</script>

<template>
  <ion-page>
    <NavBar/>
    <ion-content
        ref="content"
        :fullscreen="true"
        :style="`--background-image: ${backgroundUrl && !backgroundUrl.includes('null') ? `url(${backgroundUrl})` : ''};`"
    >
      <div
          class="flex-grow-0 flex-shrink-0 w-[280px] h-[420px] z-10 absolute left-1/2 -translate-x-1/2 top-safe-offset-12 overflow-clip rounded-2xl">

        <div
            class="flex flex-col justify-start items-start w-[280px] absolute left-0 top-0 bg-cover bg-no-repeat bg-center">
          <TMDBImage
              v-if="poster ?? data?.poster"
              :key="poster ?? data?.poster ?? 'poster'"
              :autoShadow="true"
              :path="poster ?? data?.poster"
              :colorPalette="data?.color_palette?.poster"
              :size="760"
              priority="high"
              :title="data?.title"
              aspect="poster"
              loading="eager"
              className="pointer-events-none absolute -inset-1 z-20 flex h-auto scale-100 select-none items-center place-self-start overflow-hidden w-available h-available max-h-available"
              class="m-auto children:w-full scale-100 max-h-available 5xl:w-inherit"
              type="image"/>
        </div>

        <svg
            width="280"
            height="123"
            viewBox="0 0 280 123"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-[280px] h-[122px] absolute left-0 top-[298px] blur-md"
            preserveAspectRatio="none"
        >
          <g filter="url(#filter0_bf_5719_22815)">
            <rect
                width="280"
                height="122"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <g filter="url(#filter1_bf_5719_22815)">
            <rect
                width="280"
                height="106"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <g filter="url(#filter2_bf_5719_22815)">
            <rect
                width="280"
                height="90"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <g filter="url(#filter3_bf_5719_22815)">
            <rect
                width="280"
                height="74"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <g filter="url(#filter4_bf_5719_22815)">
            <rect
                width="280"
                height="58"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <g filter="url(#filter5_bf_5719_22815)">
            <rect
                width="280"
                height="42"
                transform="matrix(1 0 0 -1 0 123)"
                fill="rgb(var(--color-focus))"
                fill-opacity="0.12"
            ></rect>
          </g>
          <defs>
            <filter
                id="filter0_bf_5719_22815"
                x="-1"
                y="0"
                width="282"
                height="124"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.5"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="0.5"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
            <filter
                id="filter1_bf_5719_22815"
                x="-2"
                y="15"
                width="284"
                height="110"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="1"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="1"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
            <filter
                id="filter2_bf_5719_22815"
                x="-3"
                y="30"
                width="286"
                height="96"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="1.5"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="1.5"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
            <filter
                id="filter3_bf_5719_22815"
                x="-4"
                y="45"
                width="288"
                height="82"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="2"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
            <filter
                id="filter4_bf_5719_22815"
                x="-5"
                y="60"
                width="290"
                height="68"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.5"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="2.5"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
            <filter
                id="filter5_bf_5719_22815"
                x="-6"
                y="75"
                width="292"
                height="54"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="3"></feGaussianBlur>
              <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5719_22815"
              ></feComposite>
              <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5719_22815"
                  result="shape"
              ></feBlend>
              <feGaussianBlur
                  stdDeviation="3"
                  result="effect2_foregroundBlur_5719_22815"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg>

        <div class="flex justify-start items-start w-[280px] absolute left-0 top-[348px] gap-4 p-4">

          <RouterLink
              :to="`/${data?.media_type}/${data?.id}/watch`"
              class="flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-[30px] bg-white/80"
              :disabled="!hasItem?.available"
              :class="{ 'opacity-70': !hasItem?.available }"
          >
            <p class="flex-grow w-[100px] text-[15px] font-semibold text-center text-[#151718]">
              {{ $t(!data ? 'loading' : hasItem?.available ? 'Play' : 'Unavailable') }}
            </p>
          </RouterLink>

          <button
              @click="trailerOpen = !trailerOpen"
              class="flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-[30px] bg-black/5  0 border border-solid border-slate-lightA-9 dark:border-slate-darkA-9"
          >
            <p class="flex-grow w-[100px] text-[15px] font-semibold text-center">
              {{ $t(!data ? 'loading' : 'Trailer') }}
            </p>
          </button>

        </div>

        <div class="flex justify-end items-start w-[280px] absolute left-0 top-0 gap-2 p-4">
          <div
              class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 p-2 rounded-[30px] bg-black/[0.48] border border-black/2"
          >
            <MoooomIcon icon="check" className="w-5"/>
          </div>
          <div
              class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 p-2 rounded-[30px] bg-black/[0.48] border border-black/2"
          >
            <MediaLikeButton :data="data" class="!p-0" :type="data?.media_type"/>
          </div>
        </div>
      </div>

      <div
          class="flex z-0 flex-col justify-start items-center self-stretch flex-grow overflow-hidden gap-4 will-change-auto text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
          style="box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16);"
      >
        <div
            class="flex justify-start items-end flex-grow-0 flex-shrink-0 -mx-4 w-available h-[410px] relative gap-2">
          <div
              class="fixed flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover bg-top"
          style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), var(--background-image) lightgray 50% / cover no-repeat;"></div>
          <div
              class="fixed flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover dark:bg-black/50"></div>
        </div>

        <div
            class="flex bg-slate-light-3 dark:bg-slate-dark-1 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 pt-16 pb-5 will-change-auto w-inherit px-6"
        >
          <p v-if="data?.title" class="self-stretch flex-grow-0 flex-shrink-0 w-[351px] text-3xl font-bold text-left" v-html="breakTitle2(data?.title ?? ' ', 'text-xl line-clamp-1')" >
          </p>
          <ion-skeleton-text v-else :animated="true" class="h-7 will-change-auto"></ion-skeleton-text>

          <div v-if="data?.overview" class="flex flex-col relative justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1">
            <p class="self-stretch relative flex-grow-0 flex-shrink-0 w-inherit text-sm leading-5 font-medium text-left min-h-[3.5rem] transition-all duration-300 overflow-hidden text-balance"
               :class="{
                [`max-h-[3.5rem] h-[3.5rem] line-clamp-3`]: (data?.overview?.length  ?? 0) > 180 && !showMore,
                [`max-h-[40em] h-auto line-clamp-none after:content-['']`]: showMore,
               }"
               ref="overview"
            >
              {{ data?.overview ?? '&nbsp;' }}
            </p>
            <div v-if="(data?.overview?.length  ?? 0) > 180"
                 class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-5 relative overflow-hidden gap-2"
            >
              <button @click="showMore = !showMore"
                      class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left underline underline-offset-2">
                <span v-if="!showMore">{{ $t('Read more') }}</span>
                <span v-else>{{ $t('Read less') }}</span>
              </button>
            </div>
          </div>
          <ion-skeleton-text v-else :animated="true" class="h-[4.55rem] will-change-auto"></ion-skeleton-text>
          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-[#05294d]/[0.08] dark:bg-[#e2f0fd]/[0.08]"></div>

          <div v-if="data?.year" class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 h-8">

            <ContentRating :size="8" v-if="data?.content_ratings"
                           class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip children:-m-0.5"
                           :ratings="data?.content_ratings"/>

            <div v-if="data?.have_items"
                 class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-7 px-2 py-1 rounded-md border bg-slate-dark-7/[0.1]  border-slate-dark-8/[0.3] dark:bg-slate-dark-11/[0.1] dark:border-slate-dark-11/[0.25]"
            >
              <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1">
                <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center">
                  {{ data?.have_items }}/{{ data?.number_of_items }}
                </p>
              </div>
            </div>

            <div v-if="data?.year"
                 class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-7 px-2 py-1 rounded-md border bg-slate-dark-7/[0.1]  border-slate-dark-8/[0.3] dark:bg-slate-dark-11/[0.1] dark:border-slate-dark-11/[0.25]"
            >
              <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1">
                <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center">
                  {{ data?.year }}
                </p>
              </div>
            </div>
          </div>
          <ion-skeleton-text v-else :animated="true" class="h-6 will-change-auto"></ion-skeleton-text>
          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]"></div>


          <InfoItem v-if="data?.genres" :data="data" title="Genres" keyName="genres" prefix="genres"/>
          <ion-skeleton-text v-else :animated="true" class="h-12 will-change-auto"></ion-skeleton-text>

          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]"></div>

          <InfoItem v-if="data?.writer" :data="{writer: [data?.writer]}" title="Writer" keyName="writer"
                    prefix="person"/>

          <InfoItem v-if="data?.creator" :data="{creator: [data?.creator]}" title="Creator"
                    keyName="creator"
                    prefix="person"/>

          <InfoItem v-if="data?.director" :data="{director: [data?.director]}" title="Director"
                    keyName="director"
                    prefix="person"/>

          <InfoItem v-if="data?.creators" :data="data" title="Creators" keyName="creators" prefix="person"/>

          <InfoItem v-if="data?.directors" :data="data" title="Directors" keyName="directors"
                    prefix="person"/>

          <InfoItem v-if="data?.writers" :data="data" title="Writers" keyName="writers" prefix="person"/>

          <InfoItem v-if="data?.keywords" :data="data" title="Keywords" keyName="keywords"/>

          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]"></div>

          <PersonCarousel v-if="data?.cast && data?.cast?.length > 0"
                        class="-mx-6"
                        :data="data?.cast"
                        title="Cast"/>

        <PersonCarousel v-if="data?.crew && data?.crew?.length > 0"
                        class="-mx-6"
                        :data="sortByPosterAlphabetized(data?.crew, 'profile', 'id')"
                        title="Crew"/>

        <ImageCarousel v-if="data?.posters && data?.posters?.length > 0"
                       class="-mx-6"
                       :data="data?.posters"
                       title="Poster"
                       type="poster"/>

        <ImageCarousel v-if="data?.backdrops && data?.backdrops?.length > 0"
                       class="-mx-6"
                       :colorPalette="data?.color_palette?.poster"
                       :data="data?.backdrops"
                       title="Backdrop"
                       type="backdrop"/>

        <MediaCarousel v-if="data?.recommendations && data?.recommendations?.length > 0"
                       class="-mx-6"
                       :colorPalette="data?.color_palette"
                       :data="data?.recommendations"
                       title="Recommendations"
                       type="poster"/>

        <MediaCarousel v-if="data?.similar && data?.similar?.length > 0"
                       class="-mx-6"
                       :colorPalette="data?.color_palette"
                       :data="data?.similar"
                       title="Similar"
                       type="poster"/>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
:root {
  --background-image: none;
}

</style>
