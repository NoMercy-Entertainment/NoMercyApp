<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import type { Swiper } from 'swiper';
import { Swiper as SwiperComponent } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import 'swiper/css';

import type { Breakpoints } from '@/lib/swiper-config';
import { breakpoints, swiperConfig } from '@/lib/swiper-config';

import { showBackdrops } from '@/store/preferences';
import { isMobile } from '@/config/global';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
const carouselEl = ref<HTMLDivElement>();

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

function afterInit() {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			carouselEl.value?.classList.remove('opacity-0');
		});
	});
}

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
	if (props.type === 'backdrop')
		return true;
	if (props.disableAutoAspect)
		return false;
	return showBackdrops.value;
});

const beforeOffset = computed(() => window.innerWidth < 800 ? 24 : 20);

const customSwiperConfig = computed(() => {
	const newBp: Breakpoints = breakpoints(backdropCards.value, props.limitCardCountBy ?? 0);

	return {
		...swiperConfig(backdropCards.value),
		breakpoints: newBp,
		lazy: true,
		slidesOffsetBefore: beforeOffset.value,
	};
});

function focusMain() {
	document.querySelector<HTMLButtonElement>(`#${props.nextId}`)?.focus();
}
</script>

<template>
	<div
		ref="carouselEl"
		class="mb-1 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left relative opacity-0 transition-opacity duration-150"
		style="content-visibility: auto; contain-intrinsic-size: auto 280px;"
	>
		<div class="flex w-available flex-1 flex-col gap-2">
			<div class="relative ml-3 w-full flex flex-shrink-0 flex-grow-1 items-center self-stretch">
				<h3 v-if="title"
					class="mr-2 ml-3 sm:ml-3 my-2 text-white/12 self-stretch flex-grow-0 flex-shrink-0 text-xl font-bold"
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
						:class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-surface-5 active:scale-95 hover:bg-surface- transition-transform duration-200 ${backButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`"
						:onclick="prev"
						tabindex="-1"
					>
						<MoooomIcon class="w-6" icon="chevronLeft" />
					</button>

					<button v-if="hasScroll" :aria-label="isLastSlide ? $t('Start slide') : $t('Next slide')"
						:class="`hidden sm:flex justify-center items-center p-1 rounded-lg bg-surface-5 active:scale-95 hover:bg-surface- transition-transform duration-200 ${hasScroll ? '' : 'cursor-not-allowed opacity-50'}`"
						:onclick="isLastSlide ? reset : next"
						tabindex="-1"
					>
						<MoooomIcon v-if="hasScroll && !isLastSlide"
							:class="`w-6 ${!nextButtonEnabled && isLastSlide ? 'opacity-0' : ''}`" icon="chevronRight"
						/>
						<MoooomIcon v-if="hasScroll && isLastSlide" :class="`w-6 ${isLastSlide ? '' : 'opacity-0'}`"
							icon="chevronLeftDouble"
						/>
					</button>
				</div>
			</div>
			<div class="gap-2 py-1 pr-0 w-available swiper">
				<SwiperComponent ref="swiper" :class="`swiper-${title?.replace(/[\s&#]/gu, '-')}`"
					:modules="[Virtual]"
					data-spatial-container="row"
					v-bind="customSwiperConfig as any" @progress="onProgress" @after-init="afterInit"
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
