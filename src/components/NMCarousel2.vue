<script setup lang="ts">
/* eslint-disable vue/prop-name-casing */
import { ref } from 'vue';
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';

import type { Component } from '@/types/config';

import { isMobile } from '@/config/global.ts';
import { scrollContainerElement } from '@/store/ui.ts';
import { showBackdrops, useOverlayCarouselButtons } from '@/store/preferences.ts';
import { scrollCenter } from '@/lib/utils.ts';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

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
	},
});

const titleEl = ref<HTMLHeadingElement>();
const route = useRoute();

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

function focusPrevious() {
	document
		.querySelector<HTMLButtonElement>(`#carousel_${props.previous_id} button`)
		?.focus();

	const previousTitle = document.querySelector<HTMLHeadingElement>(
		`#carousel_${props.previous_id} h3`,
	)!;

	if (!previousTitle || !scrollContainerElement.value)
		return;

	scrollCenter(previousTitle, scrollContainerElement.value, {
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
		:data-next-id="`carousel_${next_id}`"
		:data-previous-id="`carousel_${previous_id}`"
		class="carousel-container relative mt-2 sm:mt-6 mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left [anchor-scope:--carousel]"
	>
		<div class="flex w-available flex-1 flex-col gap-2">
			<div
				class="relative ml-2 flex flex-shrink-0 flex-grow-0 items-center self-stretch tv:hidden sm:w-4/6"
			>
				<h3
					v-if="title"
					ref="titleEl"
					class="mr-2 ml-3 sm:ml-3 my-2 text-slate-lightA-12/90 dark:text-slate-darkA-12/90 self-stretch flex-grow-0 flex-shrink-0 text-xl font-bold"
				>
					{{ title }}
				</h3>
				<slot v-else name="selector" />

				<button
					v-if="next_id"
					class="skip-navigation hidden sm:flex sm:absolute opacity-0 focus-visible:opacity-100"
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
					class="text-base text-slate-lightA-8/90 dark:text-slate-darkA-8/90 flex items-center ml-auto sm:ml-4 mr-2 sm:mr-auto"
				>
					<span class="leading-none pt-0.5">{{ more_link_text }}</span>
					<OptimizedIcon icon="chevronRight" class-name="w-6 mt-1" />
				</RouterLink>
			</div>

			<div class="carousel horizontal flex flex-shrink-0 flex-grow-0 items-stretch self-stretch overflow-x-auto scroll-smooth whitespace-nowrap snap-x snap-mandatory gap-1.5 px-5 scroll-px-5 scrollbar-none"
				:class="{
					'backdrop': showBackdrops,
					'person-page': route.path.startsWith('/person'),
					'carousel-buttons': !isMobile,
					'carousel-buttons-overlay': useOverlayCarouselButtons && !isMobile,
				}"
			>
				<template v-for="item in items" :key="item.id">
					<div class="slide">
						<component
							:is="item.component"
							v-bind="item.props"
						/>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* ===== CAROUSEL BASE STYLES ===== */
.carousel {
	overflow-x: auto;
	overscroll-behavior-x: contain;
	scroll-snap-type: x mandatory;
	anchor-name: --carousel;
	scroll-marker-group: before;
	isolation: isolate;
	--gap: 0.75rem;
	--size: 3;
}

/* ===== SLIDE STYLES ===== */
.carousel > * {
	flex: 0 0 calc((100% - (var(--size) - 1) * var(--gap)) / var(--size));
	scroll-snap-align: start;
	border-radius: 8px;
	padding: 0.2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.5rem;
	color: #333;
	aspect-ratio: 2/3;
}

.carousel.backdrop > * {
	aspect-ratio: 16/9;
}

/* ===== SCROLL BUTTONS ===== */
.carousel.carousel-buttons > *::scroll-marker,
.carousel.carousel-buttons::scroll-button(*) {
	background-color: rgb(var(--background-auto-10));
	border: none;
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	margin: 0;
	overflow: clip;
	padding: 0.35em;
	aspect-ratio: 1;
	position: fixed;
	z-index: 5;
	background-size: 1.5rem 1.5rem;
	background-repeat: no-repeat;
	background-position: center center;
	overscroll-behavior-x: contain;
	position-anchor: --carousel;
	color: #eeecec;
}

/* ===== SCROLL MARKERS ===== */
.carousel.carousel-buttons::scroll-marker-group {
	display: flex;
	align-items: flex-end;
	justify-content: center;
	gap: 0.5em;
	width: 100%;
}

.carousel.carousel-buttons > *::scroll-marker {
	content: '';
	color: #eeecec;
	background-image: url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M13%2018L8.27279%2013.2728C7.7425%2012.7425%207.47735%2012.4774%207.42653%2012.1564C7.41011%2012.0528%207.41011%2011.9472%207.42653%2011.8436C7.47735%2011.5226%207.7425%2011.2575%208.27279%2010.7272L13%206M17%2018L12.2728%2013.2728C11.7425%2012.7425%2011.4774%2012.4774%2011.4265%2012.1564C11.4101%2012.0528%2011.4101%2011.9472%2011.4265%2011.8436C11.4774%2011.5226%2011.7425%2011.2575%2012.2728%2010.7272L17%206%22%20stroke%3D%22%23EEECEC%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E');
	padding: 0;
	position: absolute;
	right: 1.6rem;
	bottom: 0.8rem;
}

.carousel-buttons-overlay::scroll-marker-group {
	z-index: 1;
	position: absolute;
	top: 66%;
}
.carousel-buttons-overlay > *::scroll-marker {
	opacity: 0;
	right: 0.2rem;
}

.carousel-buttons-overlay > *::scroll-marker:hover,
.carousel-buttons-overlay:hover > *::scroll-marker {
	opacity: 1 !important;
}

.carousel.carousel-buttons > *:not(:first-child)::scroll-marker {
	pointer-events: none !important;
	opacity: 0 !important;
}

.carousel.carousel-buttons > *::scroll-marker:hover,
.carousel.carousel-buttons::scroll-button(*):hover {
	background-color: rgb(var(--background-auto-11));
}

.carousel.carousel-buttons::scroll-button(*):focus-visible {
	outline-offset: 5px;
}

/* Left Button */
.carousel.carousel-buttons::scroll-button(left) {
	content: '';
	position-area: right top;
	translate: -300% -65%;
	color: #eeecec;
	background-image: url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M11.6667%2015.0024L6.66675%2010.0024L11.6667%205.00244%22%20stroke%3D%22%23EEECEC%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E');
}

.carousel-buttons-overlay::scroll-button(left) {
	opacity: 0;
	position-area: left center;
	translate: 110%;
}
.carousel-buttons-overlay::scroll-button(left):hover,
.carousel-buttons-overlay:hover::scroll-button(left) {
	opacity: 1;
}

.carousel.carousel-buttons::scroll-button(left):disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/* Right Button */
.carousel.carousel-buttons::scroll-button(right) {
	content: '';
	position-area: right top;
	translate: -180% -65%;
	color: #eeecec;
	background-image: url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M8.33325%2015.0024L13.3333%2010.0024L8.33325%205.00244%22%20stroke%3D%22%23EEECEC%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E ');
}

.carousel-buttons-overlay::scroll-button(right) {
	opacity: 0;
	position-area: right center;
	translate: -110%;
}

.carousel-buttons-overlay::scroll-button(right):hover,
.carousel-buttons-overlay:hover::scroll-button(right) {
	opacity: 1;
}

.carousel.carousel-buttons::scroll-button(right):disabled {
	opacity: 0;
	pointer-events: none;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */
/* Mobile Default: 3 cards */
@media (min-width: 600px) {
	.carousel {
		--size: 3;
	}
	.carousel.backdrop {
		--size: 2;
	}
}

@media (min-width: 800px) {
	.carousel {
		--size: 4;
	}
	.carousel.backdrop {
		--size: 2;
	}
}

@media (min-width: 1000px) {
	.carousel {
		--size: 5;
	}
	.carousel.backdrop {
		--size: 3;
	}
}

@media (min-width: 1200px) {
	.carousel {
		--size: 6;
	}
	.carousel.backdrop {
		--size: 3;
	}
}

@media (min-width: 1400px) {
	.carousel {
		--size: 7;
	}
	.carousel.backdrop {
		--size: 4;
	}
}

@media (min-width: 1600px) {
	.carousel {
		--size: 8;
	}
	.carousel.backdrop {
		--size: 4;
	}
}

@media (min-width: 1900px) {
	.carousel {
		--size: 9;
	}
	.carousel.backdrop {
		--size: 5;
	}
}

@media (min-width: 2200px) {
	.carousel {
		--size: 10;
	}
	.carousel.backdrop {
		--size: 6;
	}
}

@media (min-width: 2500px) {
	.carousel {
		--size: 11;
	}
	.carousel.backdrop {
		--size: 6;
	}
}

@media (min-width: 2800px) {
	.carousel {
		--size: 12;
	}
	.carousel.backdrop {
		--size: 7;
	}
}

@media (min-width: 3100px) {
	.carousel {
		--size: 13;
	}
	.carousel.backdrop {
		--size: 8;
	}
}

@media (min-width: 3400px) {
	.carousel {
		--size: 14;
	}
	.carousel.backdrop {
		--size: 8;
	}
}

/* ===== MODIFIER CLASSES ===== */
.carousel.person-page {
	--size: max(1, var(--size) - 2);
}
</style>
