<script lang="ts" setup>
import { computed, onMounted, type PropType, ref } from 'vue';

import type { HomeItem } from '@/types/api/base/home';

import i18next from '@/config/i18next';
import { isMobile } from '@/config/global';
import { breakLogoTitle } from '@/lib/stringArray';
import { pickPaletteColor } from '@/lib/colorHelper';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import { setColorPalette } from '@/store/ui';
import { onIonViewWillEnter, onIonViewWillLeave } from "@ionic/vue";

const props = defineProps({
  data: {
    type: Object as PropType<HomeItem> | undefined,
    required: false,
  },
});

const hasWatched = ref(false);

const endTime = computed(() => {
  return props.data?.duration && new Date(new Date().getTime() + (props.data?.duration * 60 * 1000)).toLocaleTimeString(i18next.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const ringPosterColor = computed(() => pickPaletteColor(props.data?.color_palette?.poster)
  ?.replace('rgb(', '')
  .replace(')', '')
  .replace(/,/gu, ' ') ?? 'var(--color-primary)');

const ringBackdropColor = computed(() => pickPaletteColor(props.data?.color_palette?.backdrop)
  ?.replace('rgb(', '')
  .replace(')', '')
  .replace(/,/gu, ' ') ?? 'var(--color-primary)');

const toggleWatched = () => {
  // if (!props.data) return;
};

onMounted(() => {
  if (props.data?.color_palette) {
    setColorPalette(props.data?.color_palette?.poster);
  }
});

onIonViewWillEnter(() => {
  if (props.data?.color_palette) {
    setColorPalette(props.data?.color_palette?.poster);
  }
});

onIonViewWillLeave(() => {
  setColorPalette(null);
});

</script>

<template>
  <div data-scroll v-if="!isMobile"
    class="card scheme-dark relative m-4 mt-0 sm:mt-4 flex flex-shrink-0 flex-grow-0 items-end justify-start gap-4 self-stretch rounded-2xl bg-black/50 p-4 text-auto-12 h-[65vh] sm:flex-col overflow-clip">

    <TMDBImage v-if="data && !isMobile" :path="data?.backdrop" :title="data?.title"
      :colorPalette="data?.color_palette?.backdrop" :style="`--color-focus: ${ringBackdropColor};`" :width="null"
      priority="high" loading="eager"
      class="!absolute !inset-0 children:!w-available flex overflow-clip border-2 border-focus rounded-2xl"
      className="relative flex !w-available min-h-full flex-shrink-0 flex-grow-0 items-end justify-start gap-4 self-stretch overflow-clip transition-opacity duration-700 bg-auto-1 h-full">
    </TMDBImage>

    <TMDBImage v-if="data && isMobile" :path="data?.poster" :title="data?.title"
      :colorPalette="data?.color_palette?.poster" :style="`--color-focus: ${ringPosterColor};`" :width="null"
      class="!absolute !inset-0 children:!w-available flex overflow-clip border-2 border-focus rounded-2xl"
      className="relative flex !w-available min-h-full flex-shrink-0 flex-grow-0 items-end justify-start gap-4 self-stretch overflow-clip transition-opacity duration-700 bg-auto-50 h-full"
      loading="eager">
    </TMDBImage>

    <div
      class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-auto-1 via-auto-1/60 bottom-0">
    </div>

    <div class="flex w-full flex-grow flex-col items-end justify-end gap-2">
      <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch rounded-3xl p-4">
        <div class="relative flex-grow flex-col items-start justify-start gap-4">
          <div class="relative flex flex-shrink-0 flex-grow-0 items-end justify-between gap-4 self-stretch w-available">

            <div v-if="data?.logo" class="flex h-screen max-h-40 max-w-md flex-grow">
              <TMDBImage v-if="data" :colorPalette="data?.color_palette?.backdrop" :path="data?.logo"
                :title="data?.title" :width="500" class="relative mr-4 justify-end translate-y-[5%]"
                className="relative h-auto w-auto self-start px-4 py-4" loading="eager" type="logo">
              </TMDBImage>
            </div>

            <p v-else class="h-screen max-h-40 w-px flex-grow content-end text-5xl font-bold">
              {{ data?.title }}
            </p>

            <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4">

              <BannerButton :href="`/${data?.media_type}/${data?.id}/watch`" title="" class="group/play">
                <MoooomIcon class="w-7" icon="playbackSpeed" />

                <div
                  class="absolute top-3 grid h-0 w-max flex-shrink-0 flex-grow-0 origin-bottom group-hover/play:grid-cols-1 items-center justify-start gap-1 rounded-md duration-300 bg-auto-1 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all left-[-31px] group-hover/play:top-[-38px]">
                  <div class="overflow-clip">
                    <p v-if="endTime" class="flex-shrink-0 flex-grow-0 text-xs font-bold px-2.5 py-0.5">
                      {{ $t('Ends at') }}
                    </p>
                  </div>
                </div>

              </BannerButton>

              <BannerButton :onclick="toggleWatched" title="">
                <MoooomIcon icon="check" class="w-7"
                  :stroke="hasWatched ? 'var(--color-green-600) ' : 'currentColor'" />
              </BannerButton>

              <MediaLikeButton v-if="data" :data="data" />

              <BannerButton :href="`/${data?.media_type}/${data?.id}`" title="">
                <MoooomIcon class="w-7" icon="infoCircle" />
              </BannerButton>

            </div>

          </div>

          <p class="max-w-4xl text-lg font-medium line-clamp-4">
            {{ data?.overview }}
          </p>

        </div>
        <div class="relative flex-grow flex-col items-start justify-start gap-4 sm:hidden">
          <div v-if="data" class="z-50 flex w-full justify-evenly gap-4">

            <RouterLink :to="`/${data?.media_type}/${data?.id}/watch`"
              class="flex h-10 w-1/2 items-center justify-between gap-2 whitespace-nowrap rounded-md pr-4 pl-3 text-black bg-auto-12 py-1.5">
              <MoooomIcon icon="playCircle" className="w-6" />
              <span class="w-full whitespace-nowrap text-center">{{ $t('Play') }}</span>
            </RouterLink>

            <RouterLink :to="`/${data?.media_type}/${data?.id}`"
              class="flex justify-center items-center relative gap-2 p-2 rounded-lg hover:bg-auto-5/6 transition-colors duration-300">
              <MoooomIcon icon="add" className="w-6" />
              <span class="w-full whitespace-nowrap text-center">
                {{ $t('Info') }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else
    class="flex h-auto w-full flex-shrink-0 flex-grow-0 items-start justify-start gap-2 self-stretch p-6 pb-0 aspect-poster -mb-6">
    <div
      class="frosting relative flex h-auto w-full flex-grow flex-col items-center justify-end overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat aspect-poster bg-focus"
      style="box-shadow: 0 8px 24px 0 rgba(0,0,0,0.08);">

      <TMDBImage v-if="data" :path="data?.poster" :title="data?.title" :colorPalette="data?.color_palette?.poster"
        :style="`--color-focus: ${ringPosterColor};`" :width="null"
        class="children:!w-available flex sm:hidden overflow-clip border-2 border-focus rounded-lg z-0 absolute -inset-0"
        className="relative flex h-auto aspect-poster !w-available min-h-full flex-shrink-0 flex-grow-0 items-end justify-start gap-4 self-stretch overflow-clip transition-opacity duration-700 bg-auto-50"
        loading="eager">

      </TMDBImage>

      <svg viewBox="0 0 343 178" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="absolute -inset-4 top-auto bottom-0 h-2/5 w-available blur-lg z-10" preserveAspectRatio="none">
        <g filter="url(#filter0_bf_5147_33391)">
          <rect width="100%" height="177" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <g filter="url(#filter1_bf_5147_33391)">
          <rect width="100%" height="161" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <g filter="url(#filter2_bf_5147_33391)">
          <rect width="100%" height="145" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <g filter="url(#filter3_bf_5147_33391)">
          <rect width="100%" height="129" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <g filter="url(#filter4_bf_5147_33391)">
          <rect width="100%" height="113" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <g filter="url(#filter5_bf_5147_33391)">
          <rect width="100%" height="97" transform="matrix(1 0 0 -1 0 178)" fill="#1B1B1B" fill-opacity="0.3"></rect>
        </g>
        <defs>
          <filter id="filter0_bf_5147_33391" x="-1" y="0" width="100%" height="179" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.5"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="0.5" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
          <filter id="filter1_bf_5147_33391" x="-2" y="15" width="100%" height="165" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="1"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="1" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
          <filter id="filter2_bf_5147_33391" x="-3" y="30" width="100%" height="151" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="1.5"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="1.5" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
          <filter id="filter3_bf_5147_33391" x="-4" y="45" width="100%" height="137" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="2" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
          <filter id="filter4_bf_5147_33391" x="-5" y="60" width="100%" height="123" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.5"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="2.5" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
          <filter id="filter5_bf_5147_33391" x="-6" y="75" width="100%" height="109" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="3"></feGaussianBlur>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5147_33391"></feComposite>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5147_33391" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="3" result="effect2_foregroundBlur_5147_33391"></feGaussianBlur>
          </filter>
        </defs>
      </svg>

      <div
        class="flex flex-col justify-end items-center self-stretch z-10 pt-10 bg-gradient-to-b from-[#0d0402]/0 to-[#0d0402]/60">
        <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-start gap-3 p-3"
          style="filter: drop-shadow(0px 1px 4px rgba(0,0,0,0.08));">
          <p class="w-full flex-shrink-0 flex-grow-0 text-center text-3xl font-bold">
            {{ breakLogoTitle(data?.title ?? '') }}
          </p>

          <div class="flex flex-shrink-0 flex-grow-0 flex-wrap justify-center gap-1 text-center text-sm">
            <p class="block whitespace-nowrap" v-for="(tag, index) in data?.tags?.slice(0, 4) ?? []" :key="tag">
              {{ tag.toTitleCase() }}{{ index < 3 ? ', ' : '' }} </p>
          </div>
        </div>
        <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-6 self-stretch p-6">
          <RouterLink :to="`/${data?.media_type}/${data?.id}/watch`"
            class="flex justify-center items-center flex-grow h-10 relative overflow-hidden gap-3 px-6 py-4 rounded-lg bg-[#fdfeff]/[0.93] text-black">
            <MoooomIcon icon="play" className="w-6" style="--fill-color:black" />
            <p class="flex-grow-0 flex-shrink-0 text-[15px] font-medium text-center text-[rgb(var(--color-auto-2))]">
              {{ $t('Play') }}
            </p>
          </RouterLink>
          <button @click="toggleWatched"
            class="frosting flex justify-center items-center flex-grow h-10 relative gap-3 px-6 py-4 rounded-lg bg-black/50">
            <MoooomIcon v-if="data?.watched" icon="removeCircle" className="w-6" />
            <MoooomIcon v-else icon="addCircle" className="w-6" />
            <p class="flex-shrink-0 flex-grow-0 text-center font-medium text-[15px]">
              <span v-if="data?.watched">{{ $t('Remove from my list') }}</span>
              <span v-else>{{ $t('Add to my list') }}</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
