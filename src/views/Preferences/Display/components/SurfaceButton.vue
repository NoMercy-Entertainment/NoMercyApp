<script lang="ts" setup>
import type { PropType } from 'vue';

// import type { surfaceColors } from '@/lib/colorHelper';
import { currentStrength, setStrengthColor } from '@/store/colorSurface.ts';

defineProps({
	background: {
		type: Object as PropType<{
			title: string;
			color: number;
		}>,
		required: true,
	},
});
</script>

<template>
	<button
		:class="{
			// 'surface-slate': background.title === 'slate',
			// 'surface-gray': background.title === 'gray',
			// 'surface-neutral': background.title === 'neutral',
			// 'surface-zinc': background.title === 'zinc',
			// 'surface-stone': background.title === 'stone',
			// 'surface-soho': background.title === 'soho',
			// 'surface-viva': background.title === 'viva',
			// 'surface-ocean': background.title === 'ocean',
			'current-surface': currentStrength === background.title,
			'not-current-surface': currentStrength !== background.title,
		}"
		:style="`--surface-strength: ${background?.color * 5}%`"
		:title="background?.title"
		class="relative box-border flex h-7 w-7 min-w-7 min-h-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-105 hover:shadow-md"
		@click="setStrengthColor(background.color)"
	>
		<span
			:style="`--surface-strength: ${background?.color * 5}%`"
			class="w-full h-full rounded-full overflow-clip border-2"
		>
			<div
				:style="`--surface-strength: ${background?.color * 5}%`"
				class="rounded-full w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				style="
          transition: height 100ms ease 0s, width 100ms ease 0s;
          transform-origin: left top;
        "
			/>
		</span>
	</button>
</template>

<style lang="scss">
.current-surface {
	background-color: transparent;

	span {
		//border-color: var(--surface-4);
		border-color: oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h);
		div {
			//background-color: var(--surface-4);
			background-color: oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h);
		}
	}
}
.not-current-surface {
	//background-color: var(--surface-4);
	background-color: oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h);
	span {
		border-color: transparent;
		div {
			//background-color: var(--surface-4);
			background-color: oklch(from var(--color-theme-4) l var(--surface-strength, 0%) h);
		}
	}
}
</style>
