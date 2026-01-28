<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';

import { isNative } from '@/config/global';
import type { Component } from '@/lib/routerHelper';
import { currentSong } from '@/store/audioPlayer';
import { scrollContainerElement, sidebarContainerElement } from '@/store/ui';
import { setIndexerItems, scrollToLetter } from '@/store/indexer';
import { useElementSize, useWindowSize } from '@vueuse/core';

const props = defineProps({
	items: {
		type: Object as PropType<Component<any>[]> | undefined,
		required: true,
	},
});

const containerRef = ref<HTMLDivElement>();

const window = useWindowSize();

const posterStyle
	= 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

// Get number of columns based on current breakpoint
const getColumnsCount = computed(() => {
	const width = window.width.value;
	// Poster style columns
	if (width >= 2200)
		return 14; // 5xl
	if (width >= 1800)
		return 9; // 3xl
	if (width >= 1536)
		return 7; // 2xl
	if (width >= 1280)
		return 7; // xl
	if (width >= 1024)
		return 6; // lg
	if (width >= 768)
		return 5; // md
	return 2; // default
});

// Calculate row count based on items and columns
const rowCount = computed(() => {
	const columns = getColumnsCount.value;
	return Math.ceil((props.items?.length ?? 0) / columns);
});

const { width: asideWidth } = useElementSize(sidebarContainerElement, {
	width: 256,
	height: 0,
});

const relativeContainerWidth = computed(() => {
	return containerRef.value?.clientWidth ?? (window.width.value - asideWidth.value);
});

// Virtual scrolling setup for rows
const virtualizer = useVirtualizer({
	count: rowCount.value ?? 0,
	getScrollElement: () => scrollContainerElement.value ?? null,
	estimateSize: () => {
		const columns = getColumnsCount.value;
		const itemWidth = relativeContainerWidth.value / columns - 8;
		return itemWidth * (3 / 2);
	},
	overscan: 5,
});

// Get items for a specific virtual row
function getRowItems(rowIndex: number) {
	const columns = getColumnsCount.value;
	const startIndex = rowIndex * columns;
	const endIndex = Math.min(startIndex + columns, props.items?.length ?? 0);
	return props.items?.slice(startIndex, endIndex) ?? [];
}

const { width } = useWindowSize();

watch([width, asideWidth], () => {
	virtualizer.value.measure();
});

// Update indexer with available items
watch(() => props.items, (items) => {
	if (items) {
		setIndexerItems(items);
		// Trigger indexer update event
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('indexer'));
		}, 100);
	}
}, { immediate: true });

// Handle scroll to letter
function handleScrollToLetter(event: Event) {
	const customEvent = event as CustomEvent<{ letter: string }>;
	const letter = customEvent.detail.letter;

	scrollToLetter(letter, props.items ?? [], (itemIndex) => {
		// Convert item index to row index
		const columns = getColumnsCount.value;
		const rowIndex = Math.floor(itemIndex / columns);

		// Scroll to the row at the given index
		virtualizer.value.scrollToIndex(rowIndex, { align: 'start', behavior: 'smooth' });
	});
}

onMounted(() => {
	// Listen for scroll to letter events
	document.addEventListener('scrollToLetter', handleScrollToLetter);
});

watch(() => virtualizer.value, () => {
	document.removeEventListener('scrollToLetter', handleScrollToLetter);
	document.addEventListener('scrollToLetter', handleScrollToLetter);
});
</script>

<template>
	<div
		:key="width + asideWidth"
		ref="containerRef"
		:class="{
			'pb-0': isNative && !currentSong,
			'pb-40': isNative && currentSong,
			'children:pb-4 sm:children:pb-3': !isNative && currentSong,
		}"
		class="border-0 p-4 w-available scrollbar-none"
	>
		<!-- Virtual scrolling container -->
		<div
			:style="{
				height: `${virtualizer.getTotalSize()}px`,
				width: '100%',
				position: 'relative',
			}"
		>
			<!-- Render each virtual row -->
			<div
				v-for="virtualRow in virtualizer.getVirtualItems()"
				:key="items[virtualRow.index]?.id"
				:style="{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					transform: `translateY(${virtualRow.start}px)`,
				}"
				:class="`grid w-full gap-x-4 scroll-smooth music-showing:pb-0 whitespace-pre ${posterStyle}`"
			>
				<component
					:is="render.component"
					v-for="(render, index) in getRowItems(virtualRow.index)"
					:key="render.id"
					:index="virtualRow.index * getColumnsCount + index"
					v-bind="render.props"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
