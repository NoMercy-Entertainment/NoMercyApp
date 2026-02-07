<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import type { VueScrollEvent } from '@/vite-env';

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

// --- Static instances: just publish to the store, GlobalScrollbar handles the rest ---
const containerEl = shallowRef<HTMLDivElement>();

function setContainerRef(el: Element | ComponentPublicInstance | null) {
	const div = el as HTMLDivElement | null;
	containerEl.value = div ?? undefined;
	if (props.static) {
		scrollContainerElement.value = div ?? undefined;
	}
}

// --- Non-static instances: own inline scrollbar ---
const refHandle = ref<HTMLSpanElement>();
const refBar = ref<HTMLDivElement>();

let rafId: number | null = null;
let hideTimeout: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let scrollFn: (() => void) | null = null;
let hovered = false;
let activeContainer: HTMLDivElement | null = null;
const cached = { containerH: 0, scrollH: 0, barH: 0 };

function recache() {
	const bar = refBar.value;
	if (!activeContainer || !bar)
		return;
	cached.containerH = activeContainer.clientHeight;
	cached.scrollH = activeContainer.scrollHeight;
	cached.barH = bar.clientHeight;
}

function showBar() {
	const bar = refBar.value;
	if (!bar)
		return;
	bar.style.opacity = '1';
}

function hideBar() {
	if (hovered)
		return;
	const bar = refBar.value;
	if (!bar)
		return;
	bar.style.opacity = '0';
}

function scheduleHide() {
	if (hideTimeout !== null)
		clearTimeout(hideTimeout);
	hideTimeout = window.setTimeout(hideBar, 1200);
}

function updatePosition() {
	const handle = refHandle.value;
	if (!activeContainer || !handle)
		return;

	const { containerH, scrollH, barH } = cached;
	if (scrollH <= containerH) {
		hideBar();
		return;
	}

	const scrollTop = activeContainer.scrollTop;
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
	if (rafId !== null)
		return;
	rafId = requestAnimationFrame(() => {
		rafId = null;
		updatePosition();
	});
}

function onContainerEnter() {
	hovered = true;
	showBar();
}
function onContainerLeave() {
	hovered = false;
	scheduleHide();
}

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
	if (!handle || !bar || !activeContainer)
		return;
	const barRect = bar.getBoundingClientRect();
	const y = Math.min(Math.max(0, e.clientY - barRect.top), barRect.height)
		- handle.clientHeight / 2;
	activeContainer.scrollTop
		= (activeContainer.scrollHeight - activeContainer.clientHeight)
			* (y / (barRect.height - handle.clientHeight));
}

function enableInlineBar() {
	disableInlineBar();
	const container = containerEl.value;
	const handle = refHandle.value;
	if (!container || !handle)
		return;

	activeContainer = container;
	container.scrollTop = 0;

	recache();
	requestAnimationFrame(() => {
		recache();
		updatePosition();
	});

	resizeObserver = new ResizeObserver(() => {
		recache();
		updatePosition();
	});
	resizeObserver.observe(container);
	if (container.firstElementChild)
		resizeObserver.observe(container.firstElementChild);

	scrollFn = onScroll;
	container.addEventListener('scroll', scrollFn, { passive: true });
	container.addEventListener('pointerenter', onContainerEnter);
	container.addEventListener('pointerleave', onContainerLeave);
	handle.addEventListener('mousedown', onDragStart);
}

function disableInlineBar() {
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}
	if (hideTimeout !== null) {
		clearTimeout(hideTimeout);
		hideTimeout = null;
	}
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
	if (activeContainer) {
		if (scrollFn)
			activeContainer.removeEventListener('scroll', scrollFn);
		activeContainer.removeEventListener('pointerenter', onContainerEnter);
		activeContainer.removeEventListener('pointerleave', onContainerLeave);
	}
	activeContainer = null;
	scrollFn = null;
	const handle = refHandle.value;
	if (handle)
		handle.removeEventListener('mousedown', onDragStart);
	document.removeEventListener('mousemove', onDrag);
	document.removeEventListener('mouseup', onDragEnd);
}

onMounted(() => {
	if (!props.static)
		enableInlineBar();
});

onUnmounted(() => {
	if (!props.static)
		disableInlineBar();
});
</script>

<template>
	<div
		:ref="setContainerRef"
		:class="{
			'group/scrollContainer': !frame,
			'group/scrollContainer-frame': frame,
		}"
		:data-music="musicVisibility"
		class="flex flex-1 h-available z-0 isolate overflow-auto will-change-scroll w-full flex-col scrollbar-none scroll-container text-surface-12"
		tabindex="1"
		@scroll="$emit('scroll', $event as unknown as VueScrollEvent)"
	>
		<slot />

		<!-- Non-static instances get their own inline scrollbar. Static instances are handled by the global GlobalScrollbar component. -->
		<div
			v-if="!static"
			ref="refBar"
			class="group/bar absolute top-0 mr-1 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5 hover:bg-surface-12/6 sm:flex scale-[100%_96%] transition-opacity duration-200"
			data-scrollbar
			style="opacity: 0;"
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
