<script setup lang="ts">
import { onBeforeMount, onMounted, PropType, ref } from 'vue';
import { Swiper } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/vue';
import { register } from 'swiper/element/bundle';

import type { Component } from '@/types/config';

import { isMobile } from '@/config/global';
import { mappedEntries } from '@/lib/stringArray';
import { Breakpoints, breakpoints, swiperConfig } from '@/lib/swiper-config';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {scrollCenter} from "@/lib/utils";
import {scrollContainerElement} from "@/store/ui";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  more_link: {
    type: String,
    required: false,
  },
  more_link_text: {
    type: String,
    required: false,
    default: 'See more',
  },
  items: {
    type: Array as PropType<Array<Component>>,
    required: false,
    default: [],
  },
  type: {
    type: String as PropType<'poster' | 'backdrop'>,
    required: false,
  },
  limitCardCountBy: {
    type: Number,
    required: false,
  },
  backdropCards: {
    type: Boolean,
    required: false,
    default: false,
  },
  index: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  previous_id: {
    type: String,
    required: true,
  },
  next_id: {
    required: true,
  }
});

const show = ref(false);
const backButtonEnabled = ref(false);
const nextButtonEnabled = ref(true);
const isLastSlide = ref(false);
const hasScroll = ref(false);
const swiper = ref<VueSwiperElement>();
const titleEl = ref<HTMLHeadingElement>();

const onProgress = (swiper: Swiper, progress: number) => {
  swiper.progress = Math.floor(((progress * 100) + 1) / 100);

  backButtonEnabled.value = !swiper.isBeginning;
  nextButtonEnabled.value = swiper.progress < 1;
  isLastSlide.value = swiper.progress === 1;
  hasScroll.value = !swiper.isLocked;
};

const onSlideChange = (swiper: Swiper) => {
  swiper.progress = Math.floor(((swiper.progress * 100) + 1) / 100);

  swiper.el?.classList.remove('opacity-0');

  backButtonEnabled.value = !swiper.isBeginning;
  nextButtonEnabled.value = swiper.progress < 1;
  isLastSlide.value = swiper.progress === 1;
  hasScroll.value = !swiper.isLocked;
};

const afterInit = (swiper: Swiper) => {
  setTimeout(() => {
    swiper.el?.classList.remove('opacity-0');
  }, 10 * props.index);
};

register();

const reset = () => {
  swiper.value?.$el?.swiper.slideTo(0, 300);

  hasScroll.value = true;
};

const next = () => {
  swiper.value?.$el?.swiper.slideNext(300);
};

const prev = () => {
  swiper.value?.$el?.swiper.slidePrev(300);
};

const offsetBefore = window.innerWidth < 800
  ? 24
  : 20;

const bp = ref<Breakpoints>();

onBeforeMount(() => {
  if (!props.limitCardCountBy) {
    bp.value = breakpoints(props.backdropCards);
    return;
  }

  const newBp: Breakpoints = <Breakpoints>{};

  for (const [key, value] of mappedEntries(breakpoints(props.backdropCards))) {
    newBp[key] = {
      ...value,
      slidesPerView: (value.slidesPerView - props.limitCardCountBy),
      slidesPerGroup: (value.slidesPerGroup - props.limitCardCountBy),
    };
  }

  bp.value = newBp;
});

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 150 * props.index);
});

const focusNext = () => {
  document.querySelector<HTMLButtonElement>(`#carousel_${props.next_id} button`)?.focus();

  const nextTitle = document.querySelector<HTMLHeadingElement>(`#carousel_${props.next_id} h3`);

  if(!nextTitle || !scrollContainerElement.value) return;

  scrollCenter(nextTitle, scrollContainerElement.value, {
    duration: 300,
    margin: 2,
  });
};

const focusPrevious = () => {
  document.querySelector<HTMLButtonElement>(`#carousel_${props.previous_id} button`)?.focus();

  const previousTitle = document.querySelector<HTMLHeadingElement>(`#carousel_${props.previous_id} h3`)!;

  if(!previousTitle || !scrollContainerElement.value) return;

  scrollCenter(previousTitle, scrollContainerElement.value, {
    duration: 300,
    margin: 2,
  });
};

const scrollToCenter = () => {
  if(!scrollContainerElement.value || !titleEl.value) return;
  scrollCenter(titleEl.value, scrollContainerElement.value, {
    duration: 300,
    margin: 2,
  });
};

</script>

<template>
  <div v-if="items?.length && show" :id="`carousel_${id}`" :data-next-id="`carousel_${next_id}`" :data-previous-id="`carousel_${previous_id}`"
    class="mt-4 mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left">
    <div class="flex w-available flex-1 flex-col gap-2">
      <div class="relative ml-2 flex flex-shrink-0 flex-grow-0 items-center self-stretch tv:hidden">
        <h3 v-if="title" ref="titleEl"
          class="text-[20px] font-bold text-auto-12 mr-2 ml-1 sm:ml-3 text-slate-dark-1 dark:text-slate-light-1">
          {{ title }}
        </h3>
        <slot v-else name="selector"></slot>

        <button v-if="next_id" class="skip-navigation hidden sm:flex sm:absolute opacity-0 focus-within:opacity-100" @click="focusNext" @focus="scrollToCenter" >
          <span v-if="next_id == 'continue'">
            {{ $t('Back to first carousel') }}
          </span>
          <span v-else>
            {{ $t('Skip to next carousel') }}
          </span>
        </button>

<!--        <button v-if="previous_id" class="skip-navigation hidden sm:flex sm:absolute opacity-0 focus-within:opacity-100" @click="focusPrevious">-->
<!--          <span v-if="previous_id == 'continue'">-->
<!--            {{ $t('Back to last carousel') }}-->
<!--          </span>-->
<!--          <span v-else>-->
<!--            {{ $t('Skip to previous carousel') }}-->
<!--          </span>-->
<!--        </button>-->

        <RouterLink v-if="more_link" :to="more_link"
          class="text-base text-slate-dark-9 dark:text-slate-light-9 flex items-center ml-auto sm:ml-4 mr-2 sm:mr-auto">
          <span class="leading-none pt-0.5">{{ more_link_text }}</span>
          <MoooomIcon icon="chevronRight" className="w-6 mt-1" />
        </RouterLink>

        <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 pr-4 ml-auto" v-if="!isMobile">

          <button v-if="hasScroll" :aria-label="$t('Previous slide')" tabindex="-1"
            class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-7 active:scale-95 hover:bg-auto-alpha-9 transition-transform duration-300"
            :class="{
              'cursor-not-allowed opacity-50': !backButtonEnabled,
            }" :onclick="prev">
            <MoooomIcon class="w-6" icon="chevronLeft" />
          </button>

          <button v-if="hasScroll" :aria-label="isLastSlide ? $t('Start slide') : $t('Next slide')" tabindex="-1"
            class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-7 active:scale-95 hover:bg-auto-alpha-9 transition-transform duration-300"
            :class="{
              'cursor-not-allowed opacity-50': !hasScroll,
            }" :onclick="isLastSlide ? reset : next">
            <MoooomIcon v-if="hasScroll && !isLastSlide" icon="chevronRight" class="w-6" :class="{
              'opacity-0': !nextButtonEnabled && isLastSlide,
            }" />
            <MoooomIcon v-if="hasScroll && isLastSlide" icon="chevronLeftDouble" class="w-6" :class="{
              'opacity-0': !isLastSlide,
            }" />
          </button>
        </div>

      </div>
      <div class="gap-3 py-1 pr-0 w-available swiper">
        <SwiperComponent v-bind="swiperConfig(backdropCards) as any" ref="swiper" class="opacity-0"
          :slidesOffsetBefore="offsetBefore" :breakpoints="bp" data-spatial-container="row" @progress="onProgress"
          @afterInit="afterInit" @slideChange="onSlideChange">

          <template v-for="(item) in items" :key="item?.id">
            <swiper-slide v-if="item?.id" class="flex">

              <component :key="item.id" :is="item.component" v-bind="item.props" />

            </swiper-slide>
          </template>
        </SwiperComponent>
      </div>
    </div>
  </div>
</template>

<style scoped>

.skip-navigation {
  left: 10px;
  background-color: #333;
  color: #fff;
  padding: 5px;
  text-decoration: none;
  z-index: 999;
  transition: top 0.3s;
}

.skip-navigation:focus {
  top: -100%;
}

</style>
