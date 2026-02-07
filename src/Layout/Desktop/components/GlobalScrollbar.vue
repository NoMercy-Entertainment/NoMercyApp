<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import router from '@/router';
import { musicVisibility } from '@/store/audioPlayer';
import { scrollContainerElement } from '@/store/ui';

const refBar = ref<HTMLDivElement>();
const refHandle = ref<HTMLSpanElement>();

// --- All scrollbar state is plain JS, never Vue reactive ---
let rafId: number | null = null;
let hideTimeout: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let scrollFn: (() => void) | null = null;
let hovered = false;

// The container we attached listeners to — tracked for reliable cleanup
let activeContainer: HTMLDivElement | null = null;

// Cached dimensions — updated only by ResizeObserver
let cached = { containerH: 0, scrollH: 0, barH: 0 };

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
	if (cached.scrollH <= cached.containerH)
		return;
	bar.style.opacity = '1';
	bar.style.pointerEvents = '';
}

function hideBar() {
	if (hovered)
		return;
	const bar = refBar.value;
	if (!bar)
		return;
	bar.style.opacity = '0';
}

function forceHideBar() {
	const bar = refBar.value;
	if (!bar)
		return;
	bar.style.opacity = '0';
	bar.style.pointerEvents = 'none';
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
		forceHideBar();
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

// --- Hover detection ---
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
	if (!handle || !bar || !activeContainer)
		return;

	const barRect = bar.getBoundingClientRect();
	const y = Math.min(Math.max(0, e.clientY - barRect.top), barRect.height)
		- handle.clientHeight / 2;
	activeContainer.scrollTop
		= (activeContainer.scrollHeight - activeContainer.clientHeight)
			* (y / (barRect.height - handle.clientHeight));
}

// Reconnect ResizeObserver to pick up new/changed content elements
function refreshObserver() {
	if (!activeContainer)
		return;

	// Force-hide bar until updatePosition decides new content is scrollable
	forceHideBar();

	if (resizeObserver)
		resizeObserver.disconnect();
	resizeObserver = new ResizeObserver(() => { recache(); updatePosition(); });
	resizeObserver.observe(activeContainer);
	if (activeContainer.firstElementChild) {
		resizeObserver.observe(activeContainer.firstElementChild);
	}

	recache();
	requestAnimationFrame(() => { recache(); updatePosition(); });
}

// --- Attach / detach from the current scroll container ---
function attach(container: HTMLDivElement) {
	detach();

	activeContainer = container;
	container.scrollTop = 0;

	refreshObserver();

	// Watch for child-list mutations (Ionic page swaps) to re-observe new content
	mutationObserver = new MutationObserver(() => { refreshObserver(); });
	mutationObserver.observe(container, { childList: true, subtree: false });

	scrollFn = onScroll;
	container.addEventListener('scroll', scrollFn, { passive: true });
	container.addEventListener('pointerenter', onContainerEnter);
	container.addEventListener('pointerleave', onContainerLeave);

	const handle = refHandle.value;
	if (handle)
		handle.addEventListener('mousedown', onDragStart);
}

function detach() {
	if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
	if (hideTimeout !== null) { clearTimeout(hideTimeout); hideTimeout = null; }
	if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
	if (mutationObserver) { mutationObserver.disconnect(); mutationObserver = null; }

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

	hideBar();
}

// React to the active scroll container changing (navigation, mount/unmount)
watch(scrollContainerElement, (container) => {
	if (container)
		attach(container);
	else detach();
});

onMounted(() => {
	if (scrollContainerElement.value) {
		attach(scrollContainerElement.value);
	}
});

onUnmounted(() => {
	detach();
	removeBeforeEach();
	removeAfterEach();
});

// Force-hide bar before navigation to prevent visual jank during transition
const removeBeforeEach = router.beforeEach(() => { forceHideBar(); });

// Scroll to top and refresh observer after navigation completes
const removeAfterEach = router.afterEach(() => {
	if (!scrollContainerElement.value)
		return;
	scrollContainerElement.value.scrollTo(0, 0);
	refreshObserver();
});
</script>

<template>
	<div
		ref="refBar"
		:class="{
			'bottom-22': musicVisibility === 'showing',
			'bottom-6': musicVisibility !== 'showing',
		}"
		:data-music="musicVisibility"
		style="position: fixed; opacity: 0;"
		class="group/bar hover:!opacity-100 right-0 top-16 mr-1 h-available music-showing:h-[calc(100vh-7rem)] sm:music-showing:h-[calc(100vh-11rem)] mt-4 mb-2 hidden rounded-full border-r-2 border-l-4 border-transparent w-3.5 hover:bg-surface-12/6 sm:flex transition-opacity duration-200"
		data-scrollbar
	>
		<span
			ref="refHandle"
			class="scrollbar-handle absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
			data-scrollbar
			draggable="true"
		/>
	</div>
</template>

<style scoped>
.scrollbar-handle {
	will-change: translate;
}
</style>
