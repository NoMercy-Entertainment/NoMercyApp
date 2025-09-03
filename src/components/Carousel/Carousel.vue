<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
import type { Swiper } from 'swiper';
import { Swiper as SwiperComponent } from 'swiper/vue';
import { register } from 'swiper/element/bundle';

import { mappedEntries } from '@/lib/stringArray';
import type { Breakpoints } from '@/lib/swiper-config';
import { breakpoints, swiperConfig } from '@/lib/swiper-config';

import { showBackdrops } from '@/store/preferences';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { isMobile } from '@/config/global';

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
	nextId: {
		type: String,
		required: false,
		default: 'next-carousel',
	},
	prevId: {
		type: String,
		required: false,
		default: 'prev-carousel',
	},
});

const backButtonEnabled = ref(false);
const nextButtonEnabled = ref(true);
const isLastSlide = ref(false);
const hasScroll = ref(false);
const swiper = ref<VueSwiperElement>();

function onProgress(swiper: Swiper, progress: number) {
	swiper.progress = Math.floor(((progress * 100) + 1) / 100);

	backButtonEnabled.value = !swiper.isBeginning;
	nextButtonEnabled.value = swiper.progress < 1;
	isLastSlide.value = swiper.progress === 1;
	hasScroll.value = !swiper.isLocked;
}

function onSlideChange(swiper: Swiper) {
	swiper.progress = Math.floor(((swiper.progress * 100) + 1) / 100);

	backButtonEnabled.value = !swiper.isBeginning;
	nextButtonEnabled.value = swiper.progress < 1;
	isLastSlide.value = swiper.progress === 1;
	hasScroll.value = !swiper.isLocked;
}

function afterInit(swiper: Swiper) {
	setTimeout(() => {
		swiper.el?.classList.remove('opacity-0');
	}, 150 * props.index);
}

register();

function reset() {
	swiper.value?.$el?.swiper?.slideTo(0, 300);

	hasScroll.value = true;
}

function next() {
	swiper.value?.$el?.swiper?.slideNext(300);
}

function prev() {
	swiper.value?.$el?.swiper?.slidePrev(300);
}

const backdropCards = computed(() => {
	return showBackdrops && !props.disableAutoAspect;
});

const customSwiperConfig = computed(() => {
	const newBp: Breakpoints = breakpoints(backdropCards.value);

	if (props.limitCardCountBy) {
		for (const [key, value] of mappedEntries(breakpoints(backdropCards.value))) {
			newBp[key] = {
				...value,
				slidesPerView: value.slidesPerView - props.limitCardCountBy,
				slidesPerGroup: value.slidesPerGroup - props.limitCardCountBy,
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

function focusMain() {
	document.querySelector<HTMLButtonElement>(`#${props.nextId}`)?.focus();
}
</script>

<template>
	<div
		class="mb-1 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left relative"
	>
		<div class="flex w-available flex-1 flex-col gap-2">
			<div class="relative ml-3 w-full flex flex-shrink-0 flex-grow-1 items-center self-stretch">
				<h3 v-if="title"
					class="mr-2 ml-3 sm:ml-3 my-2 text-slate-lightA-12/70 dark:text-slate-darkA-12/80 self-stretch flex-grow-0 flex-shrink-0 text-xl font-bold"
				>
					{{ $t(title ?? 'Continue watching') }}
				</h3>
				<slot v-else name="selector" />

				<button class="skip-navigation hidden sm:absolute opacity:0 sm:focus-within:opacity-100" @click="focusMain">
					{{ $t('Skip to next carousel') }}
				</button>

				<slot name="link" />

				<div v-if="!isMobile"
					class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 pr-4 ml-auto"
				>
					<button v-if="hasScroll" :aria-label="$t('Previous slide')"
						tabindex="-1"
						:class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-9 active:scale-95 hover:bg-auto-alpha-11 transition-transform duration-200 ${backButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`" :onclick="prev"
					>
						<OptimizedIcon class="w-6" icon="chevronLeft" />
					</button>

					<button v-if="hasScroll" :aria-label="isLastSlide ? $t('Start slide') : $t('Next slide')"
						tabindex="-1"
						:class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-auto-alpha-9 active:scale-95 hover:bg-auto-alpha-11 transition-transform duration-200 ${hasScroll ? '' : 'cursor-not-allowed opacity-50'}`" :onclick="isLastSlide ? reset : next"
					>
						<OptimizedIcon v-if="hasScroll && !isLastSlide"
							:class="`w-6 ${!nextButtonEnabled && isLastSlide ? 'opacity-0' : ''}`" icon="chevronRight"
						/>
						<OptimizedIcon v-if="hasScroll && isLastSlide" :class="`w-6 ${isLastSlide ? '' : 'opacity-0'}`"
							icon="chevronLeftDouble"
						/>
					</button>
				</div>
			</div>
			<div class="gap-3 py-1 pr-0 w-available swiper">
				<SwiperComponent v-bind="customSwiperConfig as any" ref="swiper"
					:class="`swiper-${title?.replace(/[\s&#]/gu, '-')} opacity-0`"
					data-spatial-container="row" @progress="onProgress" @after-init="afterInit"
					@slide-change="onSlideChange"
				>
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
