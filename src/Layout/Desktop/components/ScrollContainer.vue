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

function enable() {
	const handle = refHandle.value;
	const bar = refBar.value;
	const container = scrollContainerElement.value;

	if (!handle || !container || !bar)
		return;
	container.scrollTop = 0;

	const update = () => {
		if (!container)
			return;

		const height = Math.ceil(
			(container.clientHeight / container.scrollHeight) * container.clientHeight,
		);
		handle.style.height = `${height}px`;

		const scroll = container.scrollTop / container.scrollHeight;
		handle.style.top = `${scroll * 100}%`;

		if (
			(container.firstElementChild as HTMLDivElement)?.scrollHeight > height
			|| container.scrollHeight > height
		) {
			show.value = true;
		}
		else {
			show.value = false;
		}

		requestAnimationFrame(update);
	};

	requestAnimationFrame(update);

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
	const bar = refBar.value;
	const container = scrollContainerElement.value;

	if (!handle || !container || !bar)
		return;

	handle.removeEventListener('mousedown', start);
	document.removeEventListener('mouseup', end);
	document.removeEventListener('mousemove', drag);
}

onMounted(() => {
	enable();
});

onUnmounted(() => {
	disable();
});

router.afterEach(enable);

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
				:class="{
					'opacity-100': show,
					'opacity-0 pointer-events-none': !show,
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
					class="absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
					data-scrollbar
					draggable="true"
				/>
			</div>
		</Teleport>

		<div
			v-else
			ref="refBar"
			:class="{
				'opacity-100': show,
				'opacity-0 pointer-events-none': !show,
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
				class="absolute top-0 z-10 h-available right-0 bottom-0 hidden rounded-full border-r-2 border-l-4 border-transparent w-2.5 bg-surface-12/11 sm:flex scale-y-[105%]"
				data-scrollbar
				draggable="true"
			/>
		</div>
	</div>
</template>
