<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onBeforeMount, ref } from 'vue';
import type { Swiper } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import 'swiper/css';

import type { Component } from '@/types/config';
import { nmComponentMap } from '@/components/nmComponentMap';

import { isMobile } from '@/config/global';
import type { Breakpoints } from '@/lib/swiper-config';
import { breakpoints, swiperConfig } from '@/lib/swiper-config';
import { scrollCenter } from '@/lib/utils/dom';
import { scrollContainerElement } from '@/store/ui';
import { showBackdrops } from '@/store/preferences.ts';

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
	id: {
		type: String,
		required: true,
	},
	previous_id: {
		type: String,
		required: false,
	},
	next_id: {
		type: String,
		required: false,
	},
});

const backButtonEnabled = ref(false);
const nextButtonEnabled = ref(true);
const isLastSlide = ref(false);
const hasScroll = ref(false);
const swiper = ref<VueSwiperElement>();
const titleEl = ref<HTMLHeadingElement>();

function onProgress(swiper: Swiper, progress: number) {
	swiper.progress = Math.floor((progress * 100 + 1) / 100);

	backButtonEnabled.value = !swiper.isBeginning;
	nextButtonEnabled.value = swiper.progress < 1;
	isLastSlide.value = swiper.progress === 1;
	hasScroll.value = !swiper.isLocked;
}

function onSlideChange(swiper: Swiper) {
	swiper.progress = Math.floor((swiper.progress * 100 + 1) / 100);

	swiper.el?.classList.remove('opacity-0');

	backButtonEnabled.value = !swiper.isBeginning;
	nextButtonEnabled.value = swiper.progress < 1;
	isLastSlide.value = swiper.progress === 1;
	hasScroll.value = !swiper.isLocked;
}

const carouselEl = ref<HTMLDivElement>();

function afterInit() {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			carouselEl.value?.classList.remove('opacity-0');
		});
	});
}

function reset() {
	swiper.value?.$el?.swiper.slideTo(0, 300);

	hasScroll.value = true;
}

function next() {
	swiper.value?.$el?.swiper.slideNext(300);
}

function prev() {
	swiper.value?.$el?.swiper.slidePrev(300);
}

const bp = ref<Breakpoints>();

const backdropCards = computed(() => showBackdrops.value);

onBeforeMount(() => {
	bp.value = breakpoints(
		backdropCards.value,
		props.limitCardCountBy ?? 0,
	);
});

function focusNext() {
	document
		.querySelector<HTMLButtonElement>(`#carousel_${props.next_id} button`)
		?.focus();

	const nextTitle = document.querySelector<HTMLHeadingElement>(
		`#carousel_${props.next_id} h3`,
	);

	if (!nextTitle || !scrollContainerElement.value)
		return;

	scrollCenter(nextTitle, scrollContainerElement.value, {
		duration: 300,
		margin: 2,
	});
}

function scrollToCenter() {
	if (!scrollContainerElement.value || !titleEl.value)
		return;
	scrollCenter(titleEl.value, scrollContainerElement.value, {
		duration: 300,
		margin: 2,
	});
}
</script>

<template>
	<div
		v-if="items?.length"
		:id="`carousel_${id}`"
		ref="carouselEl"
		:class="{
			'sm:mt-0': !previous_id,
		}"
		:data-next-id="`carousel_${next_id}`"
		:data-previous-id="`carousel_${previous_id}`"
		class="mt-2 sm:mt-6 sm:mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-0.5 sm:gap-2 self-stretch text-left opacity-0 transition-opacity duration-150"
	>
		<div class="flex w-available flex-1 flex-col gap-0.5 sm:gap-2 pb-1">
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center self-stretch h-[52px] sm:h-auto pl-4 sm:pl-2 pr-4 sm:pr-0 pt-3 pb-1 sm:py-0"
			>
				<h3
					v-if="title"
					ref="title"
					class="mr-2 sm:ml-3 text-surface-12 self-stretch flex-grow flex-shrink-0 text-xl font-bold content-center"
				>
					{{ title }}
				</h3>
				<slot v-else name="selector" />

				<button
					v-if="next_id"
					class="skip-navigation hidden sm:flex sm:absolute opacity-0 focus-visible:opacity-100 tv:hidden"
					@click="focusNext"
					@focus="scrollToCenter"
				>
					<span v-if="next_id === 'continue'">
						{{ $t("Back to first carousel") }}
					</span>
					<span v-else>
						{{ $t("Skip to next carousel") }}
					</span>
				</button>

				<RouterLink
					v-if="more_link"
					:to="more_link"
					class="sm:hidden flex items-center ml-auto rounded px-1.5 text-xs text-surface-12 bg-surface-12/25 whitespace-nowrap"
				>
					{{ more_link_text }}
				</RouterLink>

				<RouterLink
					v-if="more_link"
					:to="more_link"
					class="hidden sm:flex text-base items-center ml-4 mr-auto"
				>
					<span class="leading-none pt-0.5">{{ more_link_text }}</span>
					<MoooomIcon class-name="w-6 mt-1" icon="chevronRight" />
				</RouterLink>

				<div
					v-if="!isMobile"
					class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 pr-4 ml-auto text-surface-11/12"
				>
					<button
						v-if="hasScroll"
						:aria-label="$t('Previous slide')"
						:class="{
							'cursor-not-allowed opacity-50': !backButtonEnabled,
						}"
						:onclick="prev"
						class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-surface-5 active:scale-95 hover:bg-surface-6 transition-transform duration-200"
						tabindex="-1"
					>
						<MoooomIcon class="w-6" icon="chevronLeft" />
					</button>

					<button
						v-if="hasScroll"
						:aria-label="isLastSlide ? $t('Start slide') : $t('Next slide')"
						:class="{
							'cursor-not-allowed opacity-50': !hasScroll,
						}"
						:onclick="isLastSlide ? reset : next"
						class="hidden sm:flex justify-center items-center p-1 rounded-lg bg-surface-5 active:scale-95 hover:bg-surface-6 transition-transform duration-200"
						tabindex="-1"
					>
						<MoooomIcon
							v-if="hasScroll && !isLastSlide"
							:class="{
								'opacity-0': !nextButtonEnabled && isLastSlide,
							}"
							class="w-6"
							icon="chevronRight"
						/>
						<MoooomIcon
							v-if="hasScroll && isLastSlide"
							:class="{
								'opacity-0': !isLastSlide,
							}"
							class="w-6"
							icon="chevronLeftDouble"
						/>
					</button>
				</div>
			</div>
			<div class="gap-3 py-1 pr-0 w-available swiper">
				<SwiperComponent
					ref="swiper"
					:breakpoints="bp"
					:modules="[Virtual]"
					data-spatial-container="row"
					v-bind="swiperConfig(backdropCards) as any"
					@progress="onProgress"
					@after-init="afterInit"
					@slide-change="onSlideChange"
				>
					<template v-for="(item, itemIndex) in items" :key="item?.id">
						<SwiperSlide v-if="item?.id" :virtual-index="itemIndex" class="flex">
							<component
								:is="nmComponentMap[item.component]"
								:key="item.id"
								v-bind="item.props"
							/>
						</SwiperSlide>
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
