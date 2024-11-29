<script setup lang="ts">
import {onBeforeMount, onMounted, PropType, ref} from 'vue';
import {Swiper} from 'swiper';
import {Swiper as SwiperComponent, SwiperSlide} from 'swiper/vue';
import {register} from 'swiper/element/bundle';

import type {Component} from '@/types/config';

import {isMobile} from '@/config/global';
import {mappedEntries} from '@/lib/stringArray';
import {Breakpoints, breakpoints, swiperConfig} from '@/lib/swiper-config';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
});

const show = ref(false);
const backButtonEnabled = ref(false);
const nextButtonEnabled = ref(true);
const isLastSlide = ref(false);
const hasScroll = ref(false);
const swiper = ref<VueSwiperElement>();

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
    ? 10
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

</script>

<template>
  <div v-if="items?.length && show"
       class="mt-4 mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch will-change-auto text-left"
  >
    <div class="flex w-available flex-1 flex-col gap-2">
      <div class="relative ml-2 flex flex-shrink-0 flex-grow-0 items-center self-stretch tv:hidden">
        <h3 v-if="title" class="text-2xl font-bold text-auto-12 mr-2 ml-1 sm:ml-3 text-slate-dark-1 dark:text-slate-light-1">
          {{ title }}
        </h3>
        <slot v-else name="selector"></slot>

        <RouterLink v-if="more_link"
                    :to="more_link"
                    class="text-base text-slate-dark-9 dark:text-slate-light-9 flex items-center ml-auto sm:ml-4 mr-2 sm:mr-auto">
          <span class="leading-none pt-0.5">{{ more_link_text }}</span>
          <MoooomIcon icon="chevronRight" className="w-6 mt-1"/>
        </RouterLink>

        <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 pr-4 ml-auto" v-if="!isMobile">

          <button v-if="hasScroll"
                  class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-7 active:scale-95 hover:bg-auto-alpha-9 transition-transform duration-300"
                  :class="{
                    'cursor-not-allowed opacity-50': !backButtonEnabled,
                  }"
                  :onclick="prev"
          >
            <MoooomIcon class="w-6" icon="chevronLeft"/>
          </button>

          <button v-if="hasScroll"
                  class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-7 active:scale-95 hover:bg-auto-alpha-9 transition-transform duration-300"
                  :class="{
                    'cursor-not-allowed opacity-50': !hasScroll,
                  }"
                  :onclick="isLastSlide ? reset : next"
          >
            <MoooomIcon v-if="hasScroll && !isLastSlide"
                        icon="chevronRight"
                        class="w-6"
                        :class="{
                          'opacity-0': !nextButtonEnabled && isLastSlide,
                        }"
            />
            <MoooomIcon
                v-if="hasScroll && isLastSlide"
                icon="chevronLeftDouble"
                class="w-6"
                :class="{
                  'opacity-0': !isLastSlide,
                }"
            />
          </button>
        </div>

      </div>
      <div class="gap-3 py-1 pr-0 w-available swiper">
        <SwiperComponent
            v-bind="swiperConfig(backdropCards) as any"
            ref="swiper"
            class="opacity-0"
            :slidesOffsetBefore="offsetBefore"
            :breakpoints="bp"
            data-spatial-container="row"
            @progress="onProgress"
            @afterInit="afterInit"
            @slideChange="onSlideChange">

          <template v-for="(item) in items"
                    :key="item?.id">
            <swiper-slide v-if="item?.id" class="flex">

              <component
                  :key="item.id"
                  :is="item.component"
                  v-bind="item.props"
              />

            </swiper-slide>
          </template>
        </SwiperComponent>
      </div>
    </div>
  </div>
</template>
