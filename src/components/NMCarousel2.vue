<script lang="ts" setup>
import type { PropType } from 'vue';
/* eslint-disable vue/prop-name-casing */
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import type { Component } from '@/types/config';

import { isMobile } from '@/config/global.ts';
import { scrollContainerElement } from '@/store/ui.ts';
import { showBackdrops, useOverlayCarouselButtons } from '@/store/preferences.ts';
import { scrollCenter } from '@/lib/utils.ts';

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
		class="carousel-container relative mt-2 sm:mt-6 mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left [anchor-scope:--carousel] w-available flex-1"
	>
		<div class="flex w-available flex-1 flex-col gap-2">
			<div
				class="relative ml-2 flex flex-shrink-0 flex-grow-0 items-center self-stretch tv:hidden sm:w-4/6"
			>
				<h3
					v-if="title"
					ref="titleEl"
					class="mr-2 ml-3 sm:ml-3 my-2 text-slate-12/90 dark:text-slate-12/90 self-stretch flex-grow-0 flex-shrink-0 text-xl font-bold"
				>
					{{ title }}
				</h3>
				<slot v-else name="selector" />

				<button
					v-if="next_id"
					class="skip-navigation hidden sm:flex sm:absolute opacity-[0.1%] focus-visible:opacity-100 -translate-y-7"
					tabindex="1"
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
					class="text-base text-slate-8/90 dark:text-slate-8/90 flex items-center ml-auto sm:ml-4 mr-2 sm:mr-auto"
					tabindex="1"
				>
					<span class="leading-none pt-0.5">{{ more_link_text }}</span>
					<MoooomIcon class-name="w-6 mt-1" icon="chevronRight" />
				</RouterLink>
			</div>

			<div
				:class="{
					'backdrop': showBackdrops,
					'person-page': route.path.startsWith('/person'),
					'carousel-buttons': !isMobile,
					'carousel-buttons-overlay': useOverlayCarouselButtons && !isMobile,
				}"
				class="carousel horizontal flex flex-shrink-0 flex-grow-0 items-stretch self-stretch overflow-x-auto scroll-smooth whitespace-nowrap snap-x snap-mandatory gap-1.5 px-5 scroll-ps-12 scroll-pe-12 scrollbar-none py-1"
			>
				<template v-for="item in items" :key="item.id">
					<figure class="slide">
						<component
							:is="item.component"
							tabindex="1"
							v-bind="item.props"
						/>
					</figure>
				</template>
			</div>
			<!--		</div> -->
		</div>
	</div>
</template>

<style scoped>
</style>
