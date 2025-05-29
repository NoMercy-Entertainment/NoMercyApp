<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, IonSkeletonText, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
import axios from "axios";
import { t } from "i18next";

import type { InfoResponse } from '@/types/api/base/info';

import i18next from "@/config/i18next";
import useServerClient from '@/lib/clients/useServerClient';
import { breakTitle2, setTitle, sortByPosterAlphabetized } from '@/lib/stringArray';
import { convertToHumanReact } from "@/lib/dateTime";
import { background, setBackground, setColorPalette, setLogo, setPoster, title } from '@/store/ui';
import { currentServer } from "@/store/currentServer";
import router from '@/router';

import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import InfoItem from '@/views/Base/Info/components/InfoItem.vue';
import Trailer from "@/views/Base/Info/components/Trailer.vue";
import HeaderItem from "@/views/Base/Person/components/HeaderItem.vue";
import Collapsible from "@/views/Base/Person/components/Collapsible.vue";
import MobileInfoCard from "@/views/Base/Info/components/MobileInfoCard.vue";
import SeasonCarousel from "@/components/Carousel/SeasonCarousel.vue";

const route = useRoute();
const enabled = ref(false);
const showMore = ref(false);
const trailerOpen = ref(false);
const trailerState = ref<true | false | 'loading'>('loading');
const trailerIndex = ref(-1);
const endTime = ref<string | 0 | null | undefined>(null);
const interval = ref<NodeJS.Timeout | null>(null);

const content = ref<VueDivElement>();

const { data } = useServerClient<InfoResponse>({
  keepForever: true,
  path: route?.fullPath,
});

watch(data, (value) => {
  content.value?.$el?.scrollToTop(window.innerHeight);
  enabled.value = true;
  trailerIndex.value = 0;

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
  if (value?.color_palette?.poster) {
    setColorPalette(value?.color_palette?.poster);
  }

  processTrailer(value);
});

const backgroundUrl = computed(() => {
  // return `${tmdbImageBaseUrl}/original${data.value?.backdrop ?? background.value}`;
  return `${currentServer.value?.serverBaseUrl}/images/original${data.value?.backdrop ?? background.value}`;
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
  if (data?.value?.color_palette?.poster) {
    setColorPalette(data?.value?.color_palette?.poster);
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

const toggleTrailer = () => {
  if (!data?.value?.videos) return;
  trailerOpen.value = !trailerOpen.value;

  const main = document.querySelector<HTMLDivElement>('#main');
  if (!main) return;

  main.style.overflow = trailerOpen.value
    ? 'hidden'
    : 'auto';
};

const incrementTrailerIndex = () => {
  if (!data?.value || data?.value?.videos?.length == 0) return;

  if (trailerIndex.value == data?.value?.videos.length - 1) {
    trailerIndex.value = 0;
  } else {
    trailerIndex.value++;
  }
  trailerIndex.value++;
};

const processTrailer = (value: InfoResponse | undefined) => {

  trailerState.value = 'loading';

  if (!value || value.videos?.length == 0 || !value.videos?.[trailerIndex.value]) {
    trailerState.value = false;
    return;
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

  axios.head(`https://trailer.nomercy.tv/${value.videos[trailerIndex.value]?.src}/${value.videos[trailerIndex.value]?.src}.webm`, {
    withCredentials: false,
  })
    .then(() => {
      trailerState.value = true;
    })
    .catch(() => {
      incrementTrailerIndex();
      trailerState.value = false;
    });
};

</script>

<template>
  <ion-page>
    <ion-content ref="content" :fullscreen="true"
      :style="`--background-image: ${backgroundUrl && !backgroundUrl.includes('null') ? `url(${backgroundUrl})` : ''};`">

      <div
        class="flex flex-col justify-start items-center self-stretch flex-grow h-auto gap-4 will-change-auto text-slate-lightA-12/70 dark:text-slate-darkA-12/80 z-0"
        style="box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16);">
        <div class="flex justify-start items-end -mx-4 w-available h-[410px] relative gap-2">
          <div
              class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover bg-top"
              style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), var(--background-image) lightgray 50% / cover no-repeat;">
          </div>
          <div
              class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover dark:bg-black/50">
          </div>
        </div>

        <div
          class="flex bg-slate-light-3 dark:bg-slate-dark-1 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 pt-16 pb-5 will-change-auto w-inherit px-6">
          <p class="self-stretch flex-grow-0 flex-shrink-0 w-[351px] text-2xl font-bold text-left z-10"
            v-html="breakTitle2(data?.title || title || '', 'text-lg line-clamp-2')">
          </p>

          <Collapsible v-if="data?.overview" :text="data?.overview" :maxLines="3" />

          <div v-if="data"
            class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 flex-wrap">

            <HeaderItem v-if="data?.year" title="" :data="data?.year.toString()" />

            <HeaderItem v-if="data?.content_ratings.length" title="">
              <ContentRating :size="4"
                class="h-full object-scale-down rounded-lg overflow-clip"
                :ratings="data?.content_ratings" />
            </HeaderItem>

            <HeaderItem v-if="data?.have_items" title="" :data="`${data?.have_items}/${data?.number_of_items}`" />

            <HeaderItem v-if="data?.duration" title="">
              <span class="whitespace-nowrap">
                {{ convertToHumanReact(t, data?.duration, true) }}
              </span>
            </HeaderItem>

            <HeaderItem v-if="data?.voteAverage" title="">
              <span class="whitespace-nowrap">⭐ ️{{ data?.voteAverage?.toFixed(0) }}/10</span>
            </HeaderItem>


          </div>

          <ion-skeleton-text v-else :animated="true" class="h-6 will-change-auto"></ion-skeleton-text>
          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]">
          </div>

          <InfoItem v-if="data?.genres" :data="data" title="Genres" keyName="genres" prefix="genres" />
          <ion-skeleton-text v-else :animated="true" class="h-12 will-change-auto"></ion-skeleton-text>

          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]">
          </div>

          <InfoItem v-if="data?.writer" :data="{ writer: [data?.writer] }" title="Writer" keyName="writer"
            prefix="person" />

          <InfoItem v-if="data?.creator" :data="{ creator: [data?.creator] }" title="Creator" keyName="creator"
            prefix="person" />

          <InfoItem v-if="data?.director" :data="{ director: [data?.director] }" title="Director" keyName="director"
            prefix="person" />

          <InfoItem v-if="data?.creators" :data="data" title="Creators" keyName="creators" prefix="person" />

          <InfoItem v-if="data?.directors" :data="data" title="Directors" keyName="directors" prefix="person" />

          <InfoItem v-if="data?.writers" :data="data" title="Writers" keyName="writers" prefix="person" />

          <InfoItem v-if="data?.keywords" :data="data" title="Keywords" keyName="keywords" />

          <div class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]">
          </div>

          <SeasonCarousel v-if="data?.seasons && data?.seasons?.length > 0" :data="data?.seasons" type="backdrop"
                          class="-mx-6" :limitCardCountBy="0" />

          <PersonCarousel v-if="data?.cast && data?.cast?.length > 0" class="-mx-6" :data="data?.cast" title="Cast" />

          <PersonCarousel v-if="data?.crew && data?.crew?.length > 0" class="-mx-6"
            :data="sortByPosterAlphabetized(data?.crew, 'profile', 'id')" title="Crew" />

          <ImageCarousel v-if="data?.posters && data?.posters?.length > 0" class="-mx-6" :data="data?.posters"
            title="Poster" type="poster" />

          <ImageCarousel v-if="data?.backdrops && data?.backdrops?.length > 0" class="-mx-6"
            :colorPalette="data?.color_palette?.poster" :data="data?.backdrops" title="Backdrop" type="backdrop" />

          <MediaCarousel v-if="data?.recommendations && data?.recommendations?.length > 0" class="-mx-6"
            :colorPalette="data?.color_palette" :data="data?.recommendations" title="Recommendations" type="poster" />

          <MediaCarousel v-if="data?.similar && data?.similar?.length > 0" class="-mx-6"
            :colorPalette="data?.color_palette" :data="data?.similar" title="Similar" type="poster" />

        </div>
      </div>

      <MobileInfoCard :data="data" :toggleTrailer="toggleTrailer" />

      <Trailer v-if="data?.videos && data?.videos?.length > 0 && trailerOpen" :key="trailerIndex"
        :incrementTrailerIndex="incrementTrailerIndex" :index="trailerIndex" :open="trailerOpen"
        :title="data?.title ?? data?.name" :toggle="toggleTrailer" :videos="data?.videos"
        class="absolute inset-0 h-full w-full z-999" />

    </ion-content>
  </ion-page>
</template>

<style scoped>
:root {
  --background-image: none;
}
</style>
