<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import type { VueScrollEvent } from '@/vite-env';

import router from '@/router';
import { musicVisibility } from '@/store/audioPlayer';
import { scrollContainerElement } from '@/store/ui.ts';

defineProps({
	autoHide: {
		type: Boolean,
		default: false,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
	static: {
		type: Boolean,
		default: true,
	},
	frame: {
		type: Boolean,
		default: false,
	},
});
defineEmits<{
	(e: 'scroll', event: VueScrollEvent): void;
}>();
// import {scrollContainerElement} from "@/store/ui";

const refHandle = ref<HTMLSpanElement>();
const refBar = ref<HTMLDivElement>();
const show = ref(false);
const isScrolling = ref(false);
let updateScrollbar: (() => void) | null = null;
let rafId: number | null = null;
let scrollTimeout: number | null = null;
let cachedDimensions = { clientHeight: 0, scrollHeight: 0 };
let resizeObserver: ResizeObserver | null = null;

function enable() {
	// Always clean up first to prevent duplicate listeners/observers
	disable();

	const handle = refHandle.value;
	const bar = refBar.value;
	const container = scrollContainerElement.value;

	if (!handle || !container || !bar)
		return;

	container.scrollTop = 0;

	// Cache dimensions - only recalculate on resize, not on scroll
	const updateDimensionsCache = () => {
		if (!container) return;
		cachedDimensions.clientHeight = container.clientHeight;
		cachedDimensions.scrollHeight = container.scrollHeight;

		// Trigger update after dimensions change
		if (updateScrollbar) {
			updateScrollbar();
		}
	};

	const performUpdate = () => {
		if (!container || !handle || !bar)
			return;

		// Use cached dimensions (updated by ResizeObserver) to avoid forced layout
		const { clientHeight, scrollHeight } = cachedDimensions;
		const scrollTop = container.scrollTop;

		// Hide scrollbar if no scrolling is needed (unless actively scrolling)
		if (scrollHeight <= clientHeight) {
			show.value = isScrolling.value;
			rafId = null;
			return;
		}

		show.value = true;

		// Calculate scrollbar handle size
		const handleHeight = Math.ceil((clientHeight / scrollHeight) * clientHeight);
		const barHeight = bar.clientHeight;
		const maxHandleTop = barHeight - handleHeight;

		// Calculate scroll position
		const maxScroll = scrollHeight - clientHeight;
		const scrollRatio = maxScroll > 0 ? scrollTop / maxScroll : 0;
		const handleTop = scrollRatio * maxHandleTop;

		// Apply size and position directly with GPU acceleration
		handle.style.height = `${handleHeight}px`;
		handle.style.translate = `0 ${handleTop}px`;

		rafId = null;
	};

	// Throttle updates to once per animation frame
	updateScrollbar = () => {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(performUpdate);

		// Mark as scrolling and keep thumb visible
		isScrolling.value = true;

		// Clear existing timeout
		if (scrollTimeout !== null) {
			clearTimeout(scrollTimeout);
		}

		// Hide thumb after scrolling stops for 1 second
		scrollTimeout = window.setTimeout(() => {
			isScrolling.value = false;
			performUpdate();
		}, 1000);
	};

	// Initial dimension cache
	updateDimensionsCache();

	// Force update after DOM is ready
	requestAnimationFrame(() => {
		updateDimensionsCache();
		performUpdate();
	});

	// Observe container resize to update cached dimensions
	resizeObserver = new ResizeObserver(() => {
		updateDimensionsCache();
	});
	resizeObserver.observe(container);
	if (container.firstElementChild) {
		resizeObserver.observe(container.firstElementChild as Element);
	}

	// Update on scroll events (uses cached dimensions)
	container.addEventListener('scroll', updateScrollbar, { passive: true });

	handle.addEventListener('mousedown', start);
}

function end() {
	document.removeEventListener('mouseup', end);
	document.removeEventListener('mousemove', drag);
}

function start(e: MouseEvent) {
	e.preventDefault();

	document.addEventListener('mouseup', end);
	document.addEventListener('mousemove', drag);
}

function lim(down: number, y: number, up: number) {
	return Math.min(Math.max(down, y), up);
}

function drag(e: MouseEvent) {
	e.preventDefault();

	const handle = refHandle.value;
	const bar = refBar.value;
	const container = scrollContainerElement.value;

	if (
		!handle
		|| !container
		|| !bar
		|| !!(e.target as HTMLDivElement)?.dataset?.scrollbar
	) {
		return;
	}

	const y
		= lim(0, e.clientY - bar!.getBoundingClientRect().top, bar!.clientHeight)
			- handle.clientHeight / 2;

	container.scrollTop
		= (container.scrollHeight - container.clientHeight)
			* (y / (bar!.clientHeight - handle!.clientHeight));
}

function disable() {
	const handle = refHandle.value;
	const container = scrollContainerElement.value;

	// Clean up RAF even if refs are missing
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}

	// Clean up scroll timeout
	if (scrollTimeout !== null) {
		clearTimeout(scrollTimeout);
		scrollTimeout = null;
	}

	// Reset scrolling state
	isScrolling.value = false;

	// Clean up ResizeObserver even if refs are missing
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}

	// Clean up scroll listener if container exists
	if (container && updateScrollbar) {
		container.removeEventListener('scroll', updateScrollbar);
	}
	updateScrollbar = null;

	// Clean up mouse events if handle exists
	if (handle) {
		handle.removeEventListener('mousedown', start);
	}

	// Always remove document-level listeners
	document.removeEventListener('mouseup', end);
	document.removeEventListener('mousemove', drag);
}

onMounted(() => {
	enable();
});

onUnmounted(() => {
	disable();
});

let currentSection = '';
router.afterEach((to) => {
	const newSection = to.path.split('/')[1] ?? '';
	if (newSection === currentSection) {
		scrollContainerElement.value?.scrollTo(0, 0);
		return;
	}
	currentSection = newSection;
	enable();
});

function mouseEnter() {
	show.value = true;
}

function mouseLeave() {
	show.value = false;
}

function handleFocus() {
	// scrollContainerElement.value?.querySelector('.group\\/scrollContainer:not(:has(:focus)) a,.group\\/scrollContainer:not(:has(:focus)) button')?.focus();
}
</script>

<template>
	<div
		ref="scrollContainerElement"
		:class="{
			'group/scrollContainer': !frame,
			'group/scrollContainer-frame': frame,
		}"
		:data-music="musicVisibility"
		class="flex flex-1 h-available music-showing:h-[calc(100vh-7rem)] sm:music-showing:h-[calc(100vh-11rem)] z-0 isolate overflow-auto will-change-scroll w-full flex-col scrollbar-none scroll-container text-surface-12"
		tabindex="1"
		@focus="handleFocus"
		@mouseleave="mouseLeave"
		@mousemove="mouseEnter"
		@scroll="$emit('scroll', $event as unknown as VueScrollEvent)"
	>
		<slot />

		<Teleport v-if="static" to="body">
			<div
				ref="refBar"
				@mousemove="mouseEnter"
				:class="{
					'opacity-100': show,
					'opacity-0': !show,
					'top-16 bottom-6 mr-1': static,
					'top-0 bottom-0 mr-1': !static,
					'bottom-20': musicVisibility === 'showing',
					className,
				}"
				:style="`position: ${static ? 'fixed' : 'absolute'}`"
				class="right-0 mt-2 mb-2 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5  group-active/scrollContainer-frame:bg-surface-12/6 hover:bg-surface-12/6 sm:flex"
				data-scrollbar
			>
				<span
					ref="refHandle"
					:class="{
						'opacity-0 group-hover/scrollContainer-frame:opacity-100':
							autoHide && !show,
						'!transition-none': !show,
					}"
					class="scrollbar-handle absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
					data-scrollbar
					draggable="true"
				/>
			</div>
		</Teleport>

		<div
			v-else
			ref="refBar"
			@mousemove="mouseEnter"
			:class="{
				'opacity-100': show,
				'opacity-0': !show,
			}"
			class="group/bar absolute top-0 mr-1 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5 group-active/scrollContainer-frame:bg-surface-12/6 hover:bg-surface-12/6 sm:flex scale-[100%_96%]"
			data-scrollbar
		>
			<span
				ref="refHandle"
				:class="{
					'opacity-0 group-hover/scrollContainer:opacity-100 group-active/scrollContainer:bg-surface-2/9':
						!static && autoHide,
					'!transition-none': !show,
				}"
				class="scrollbar-handle absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
				data-scrollbar
				draggable="true"
			/>
		</div>
	</div>
</template>

<style scoped>
/* Scrollbar handle position controlled by JavaScript with GPU acceleration */
.scrollbar-handle {
	will-change: translate;
}
</style>
