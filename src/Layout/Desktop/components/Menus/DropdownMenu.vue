<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';

import { onClickOutside } from '@vueuse/core';
import { twMerge } from 'tailwind-merge';
import router from '@/router';
import { deviceMenuOpen, equalizerMenuOpen, lyricsMenuOpen, queueMenuOpen } from '@/store/audioPlayer';

defineProps({
	className: {
		type: String,
		required: false,
	},
	direction: {
		type: String as PropType<'up' | 'down'>,
		required: false,
		default: 'down',
	},
	translate: {
		type: String,
		required: false,
		default: 'translate-x-0',
	},
});

const open = ref(false);
const menu = ref();

onClickOutside(menu, () => (open.value = false));

const id = ref('');

function handleClick(e: MouseEvent) {
	equalizerMenuOpen.value = false;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	e.stopPropagation();
	open.value = !open.value;
}

router.beforeEach(() => {
	open.value = false;
});

function handleFocusOut(e: FocusEvent) {
	const nodes = Array.from(
		(e.target as HTMLDivElement).querySelectorAll<HTMLDivElement>('*'),
	);

	if (nodes.some(node => (node as any).active))
		return;

	if (menu.value && !menu.value.contains(e.relatedTarget as Node)) {
		open.value = false;
	}
}

function handleKeyDown(e: KeyboardEvent) {
	if (e.key === 'Escape') {
		open.value = false;
	}
}
</script>

<template>
	<div
		ref="menu"
		class="relative flex h-auto items-center gap-2 group"
		@focusout="handleFocusOut($event)"
		@keydown="handleKeyDown($event)"
	>
		<div
			:class="
				twMerge(
					'flex justify-center items-center relative gap-2 bg-transparent focus:bg-surface-2 hover:text-surface-12 transition-colors duration-200',
					className,
				)
			"
			aria-label="Toggle dropdown menu"
			@click="handleClick"
		>
			<slot :open="open" name="button" />
		</div>

		<div
			:id="`_dropdown_menu_${id}`"
			:class="{
				'grid-rows-[1fr] border-[#e2f0fd]/4': open,
				'grid-rows-[0fr] border-transparent': !open,
				'bottom-auto origin-top top-full': direction === 'down',
				'top-auto origin-bottom bottom-full': direction === 'up',
				[translate]: true,
			}"
			class="absolute w-max ml-[100%] sm:ml-[100%] mb-1 sm:mt-1 border grid transition-all duration-200 rounded-xl shadow-2xl overflow-clip grid-rows-[0fr] border-transparent right-0 z-10"
		>
			<div class="overflow-hidden">
				<div
					class="flex w-full flex-col items-start justify-start rounded-xl min-w-40 min-h-20 overflow-clip children:rounded-xl children:overflow-clip border-1 bg-surface-2 border-surface-7"
					role="dialog"
				>
					<slot :open="open" />
				</div>
			</div>
		</div>
	</div>
</template>
