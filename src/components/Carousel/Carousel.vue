<script setup lang="ts">
import {computed, PropType, ref, watch} from 'vue';
import { useTranslation } from 'i18next-vue';
import { Swiper } from 'swiper';
import { Swiper as SwiperComponent } from 'swiper/vue';
import { register } from 'swiper/element/bundle';

import { mappedEntries } from '@/lib/stringArray';
import { Breakpoints, breakpoints, swiperConfig } from "@/lib/swiper-config";

import { showBackdrops } from '@/store/preferences';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { isMobile } from '@/config/global';

const { t } = useTranslation();

const props = defineProps({
    title: {
        type: String,
        required: false,
    },
    type: {
        type: String as PropType<'poster' | 'backdrop'>,
        required: false,
        default: 'poster',
    },
    index: {
        type: Number,
        required: false,
        default: 0,
    },
    limitCardCountBy: {
        type: Number,
        required: false,
    },
    moreLink: {
        type: String,
        required: false,
    },
    disableAutoAspect: {
        type: Boolean,
        required: false,
        default: false,
    },
});

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

    backButtonEnabled.value = !swiper.isBeginning;
    nextButtonEnabled.value = swiper.progress < 1;
    isLastSlide.value = swiper.progress === 1;
    hasScroll.value = !swiper.isLocked;
};

const afterInit = (swiper: Swiper) => {
    setTimeout(() => {
        swiper.el?.classList.remove('opacity-0');
    }, 150 * props.index);
};

register();

const reset = () => {
    swiper.value?.$el?.swiper?.slideTo(0, 300);

    hasScroll.value = true;
};

const next = () => {
    swiper.value?.$el?.swiper?.slideNext(300);
};

const prev = () => {
    swiper.value?.$el?.swiper?.slidePrev(300);
};

const backdropCards = computed(() => {
    return showBackdrops && !props.disableAutoAspect
})

const customSwiperConfig = computed(() => {

    const newBp: Breakpoints = breakpoints(backdropCards.value);

    if (props.limitCardCountBy) {
      for (const [key, value] of mappedEntries(breakpoints(backdropCards.value))) {
        newBp[key] = {
          ...value,
          slidesPerView: value.slidesPerView - props.limitCardCountBy,
          slidesPerGroup: value.slidesPerGroup - props.limitCardCountBy
        };
      }
    }

    return {
      ...swiperConfig(backdropCards.value),
      breakpoints: newBp,
      slidesOffsetBefore: window.innerWidth < 800 ? 24 : 20,
    };
});

watch(customSwiperConfig, value => console.log(value));

const focusMain = () => {
  // document.querySelector<HTMLButtonElement>(`#${props.nextId}`)?.focus();
};

</script>

<template>
    <div
        class="mb-1 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left relative">
        <div class="flex w-available flex-1 flex-col gap-2">
            <div class="relative ml-3 w-full flex flex-shrink-0 flex-grow-1 items-center self-stretch">
                <h3 v-if="title"
                    class="text-2xl font-bold text-auto-12 mr-2 ml-4 sm:ml-3 my-2 text-slate-dark-1 dark:text-slate-light-1">
                    {{ t(title ?? 'Continue watching') }}
                </h3>
                <slot v-else name="selector"></slot>

                <button class="skip-navigation hidden sm:absolute opacity:0 sm:focus-within:opacity-100" @click="focusMain">
                  {{ $t('Skip to next carousel') }}
                </button>

                <slot name="link"></slot>

                <div class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 pr-4 ml-auto"
                    v-if="!isMobile">

                    <button :aria-label="$t('Previous slide')" tabindex="-1"
                        :class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-9 active:scale-95 hover:bg-auto-alpha-11 transition-transform duration-300 ${backButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`"
                        :onclick="prev" v-if="hasScroll">
                        <MoooomIcon class="w-6" icon="chevronLeft" />
                    </button>

                    <button :aria-label="isLastSlide ? $t('Start slide') : $t('Next slide')" tabindex="-1"
                        :class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-9 active:scale-95 hover:bg-auto-alpha-11 transition-transform duration-300 ${hasScroll ? '' : 'cursor-not-allowed opacity-50'}`"
                        :onclick="isLastSlide ? reset : next" v-if="hasScroll">
                        <MoooomIcon :class="`w-6 ${!nextButtonEnabled && isLastSlide ? 'opacity-0' : ''}`"
                            icon="chevronRight" v-if="hasScroll && !isLastSlide" />
                        <MoooomIcon :class="`w-6 ${isLastSlide ? '' : 'opacity-0'}`" icon="chevronLeftDouble"
                            v-if="hasScroll && isLastSlide" />
                    </button>
                </div>
            </div>
            <div class="gap-3 py-1 pr-0 w-available swiper">
                <SwiperComponent v-bind="customSwiperConfig as any" ref="swiper"
                    :class="`swiper-${title?.replace(/[\s&#]/gu, '-')} opacity-0`"
                    data-spatial-container="row" @progress="onProgress" @afterInit="afterInit"
                    @slideChange="onSlideChange">
                    <slot />
                </SwiperComponent>
            </div>
        </div>
    </div>
</template>

<style scoped>

.skip-navigation {
  top: -50px;
  left: 10px;
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-decoration: none;
  z-index: 999;
  transition: top 0.3s;
}

.skip-navigation:focus {
  top: 0.5rem;
}

</style>
