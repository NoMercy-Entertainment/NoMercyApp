<script lang="ts" setup>
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import type { VueScrollEvent } from '@/vite-env';

import router from '@/router';
import { musicVisibility } from '@/store/audioPlayer';
import { scrollContainerElement } from '@/store/ui.ts';

const props = defineProps({
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

// Each instance owns its own container ref — only static instances
// publish it to the store so other components (NMCarousel, TrackCard, etc.) can use it.
const containerEl = shallowRef<HTMLDivElement>();
const refHandle = ref<HTMLSpanElement>();
const refBar = ref<HTMLDivElement>();

// --- All scrollbar state is plain JS, never Vue reactive ---
let rafId: number | null = null;
let hideTimeout: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let scrollFn: (() => void) | null = null;
let hovered = false;

// Cached dimensions — updated only by ResizeObserver
let cached = { containerH: 0, scrollH: 0, barH: 0 };

function recache() {
	const container = containerEl.value;
	const bar = refBar.value;
	if (!container || !bar) return;
	cached.containerH = container.clientHeight;
	cached.scrollH = container.scrollHeight;
	cached.barH = bar.clientHeight;
}

function showBar() {
	const bar = refBar.value;
	if (!bar) return;
	bar.style.opacity = '1';
}

function hideBar() {
	if (hovered) return;
	const bar = refBar.value;
	if (!bar) return;
	bar.style.opacity = '0';
}

function scheduleHide() {
	if (hideTimeout !== null) clearTimeout(hideTimeout);
	hideTimeout = window.setTimeout(hideBar, 1200);
}

function updatePosition() {
	const container = containerEl.value;
	const handle = refHandle.value;
	if (!container || !handle) return;

	const { containerH, scrollH, barH } = cached;
	if (scrollH <= containerH) {
		hideBar();
		return;
	}

	const scrollTop = container.scrollTop;
	const handleHeight = Math.ceil((containerH / scrollH) * containerH);
	const maxHandleTop = barH - handleHeight;
	const maxScroll = scrollH - containerH;
	const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;

	handle.style.height = `${handleHeight}px`;
	handle.style.translate = `0 ${ratio * maxHandleTop}px`;

	showBar();
	scheduleHide();
}

function onScroll() {
	if (rafId !== null) return;
	rafId = requestAnimationFrame(() => {
		rafId = null;
		updatePosition();
	});
}

// --- Hover detection via native events (no Vue reactivity) ---
function onContainerEnter() {
	hovered = true;
	showBar();
}

function onContainerLeave() {
	hovered = false;
	scheduleHide();
}

// --- Drag handling ---
function onDragStart(e: MouseEvent) {
	e.preventDefault();
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', onDragEnd);
}

function onDragEnd() {
	document.removeEventListener('mousemove', onDrag);
	document.removeEventListener('mouseup', onDragEnd);
}

function onDrag(e: MouseEvent) {
	e.preventDefault();
	const handle = refHandle.value;
	const bar = refBar.value;
	const container = containerEl.value;
	if (!handle || !bar || !container) return;

	const barRect = bar.getBoundingClientRect();
	const y = Math.min(Math.max(0, e.clientY - barRect.top), barRect.height)
		- handle.clientHeight / 2;
	container.scrollTop
		= (container.scrollHeight - container.clientHeight)
			* (y / (barRect.height - handle.clientHeight));
}

// --- Lifecycle ---
function enable() {
	disable();

	const container = containerEl.value;
	const handle = refHandle.value;
	if (!container || !handle) return;

	container.scrollTop = 0;

	recache();
	requestAnimationFrame(() => {
		recache();
		updatePosition();
	});

	resizeObserver = new ResizeObserver(recache);
	resizeObserver.observe(container);
	if (container.firstElementChild) {
		resizeObserver.observe(container.firstElementChild);
	}

	scrollFn = onScroll;
	container.addEventListener('scroll', scrollFn, { passive: true });
	container.addEventListener('pointerenter', onContainerEnter);
	container.addEventListener('pointerleave', onContainerLeave);
	handle.addEventListener('mousedown', onDragStart);
}

function disable() {
	if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
	if (hideTimeout !== null) { clearTimeout(hideTimeout); hideTimeout = null; }
	if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }

	const container = containerEl.value;
	if (container) {
		if (scrollFn) container.removeEventListener('scroll', scrollFn);
		container.removeEventListener('pointerenter', onContainerEnter);
		container.removeEventListener('pointerleave', onContainerLeave);
	}
	scrollFn = null;

	const handle = refHandle.value;
	if (handle) handle.removeEventListener('mousedown', onDragStart);

	document.removeEventListener('mousemove', onDrag);
	document.removeEventListener('mouseup', onDragEnd);
}

onMounted(() => {
	// Static instances are the main page scroll container — publish to the store
	if (props.static) {
		scrollContainerElement.value = containerEl.value;
	}
	enable();
});

onUnmounted(() => {
	disable();
	// Only clear the store ref if we're the one that set it
	if (props.static && scrollContainerElement.value === containerEl.value) {
		scrollContainerElement.value = undefined;
	}
});

let currentSection = '';
router.afterEach((to) => {
	// Only the main (static) scroll container reacts to route changes
	if (!props.static) return;

	const newSection = to.path.split('/')[1] ?? '';
	if (newSection === currentSection) {
		containerEl.value?.scrollTo(0, 0);
		return;
	}
	currentSection = newSection;
	// Re-publish to store in case the element was recreated
	scrollContainerElement.value = containerEl.value;
	enable();
});
</script>

<template>
	<div
		ref="containerEl"
		:class="{
			'group/scrollContainer': !frame,
			'group/scrollContainer-frame': frame,
		}"
		:data-music="musicVisibility"
		class="flex flex-1 h-available music-showing:h-[calc(100vh-7rem)] sm:music-showing:h-[calc(100vh-11rem)] z-0 isolate overflow-auto will-change-scroll w-full flex-col scrollbar-none scroll-container text-surface-12"
		tabindex="1"
		@scroll="$emit('scroll', $event as unknown as VueScrollEvent)"
	>
		<slot />

		<Teleport v-if="static" to="body">
			<div
				ref="refBar"
				:class="{
					'top-16 bottom-6 mr-1': static,
					'bottom-20': musicVisibility === 'showing',
					className,
				}"
				:style="`position: ${static ? 'fixed' : 'absolute'}; opacity: 0;`"
				class="right-0 mt-2 mb-2 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5 hover:bg-surface-12/6 sm:flex transition-opacity duration-200"
				data-scrollbar
			>
				<span
					ref="refHandle"
					class="scrollbar-handle absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
					data-scrollbar
					draggable="true"
				/>
			</div>
		</Teleport>

		<div
			v-else
			ref="refBar"
			style="opacity: 0;"
			class="group/bar absolute top-0 mr-1 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5 hover:bg-surface-12/6 sm:flex scale-[100%_96%] transition-opacity duration-200"
			data-scrollbar
		>
			<span
				ref="refHandle"
				class="scrollbar-handle absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
				data-scrollbar
				draggable="true"
			/>
		</div>
	</div>
</template>

<style scoped>
.scrollbar-handle {
	will-change: translate;
}
</style>
