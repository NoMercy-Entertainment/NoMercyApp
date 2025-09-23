<script lang="ts" setup>
import type { PropType } from 'vue';

import type { themeColors } from '@/lib/colorHelper';
import { colorTheme, setColorTheme } from '@/store/colorTheme';

defineProps({
	theme: {
		type: Object as PropType<(typeof themeColors)[0]>,
		required: true,
	},
});
</script>

<template>
	<button
		:class="{
			'theme-amber': theme.title === 'amber',
			'theme-blue': theme.title === 'blue',
			'theme-bronze': theme.title === 'bronze',
			'theme-brown': theme.title === 'brown',
			'theme-crimson': theme.title === 'crimson',
			'theme-cyan': theme.title === 'cyan',
			'theme-gold': theme.title === 'gold',
			'theme-grass': theme.title === 'grass',
			'theme-gray': theme.title === 'gray',
			'theme-green': theme.title === 'green',
			'theme-indigo': theme.title === 'indigo',
			'theme-lime': theme.title === 'lime',
			'theme-mauve': theme.title === 'mauve',
			'theme-mint': theme.title === 'mint',
			'theme-olive': theme.title === 'olive',
			'theme-orange': theme.title === 'orange',
			'theme-pink': theme.title === 'pink',
			'theme-plum': theme.title === 'plum',
			'theme-purple': theme.title === 'purple',
			'theme-red': theme.title === 'red',
			'theme-sage': theme.title === 'sage',
			'theme-sand': theme.title === 'sand',
			'theme-sky': theme.title === 'sky',
			'theme-slate': theme.title === 'slate',
			'theme-teal': theme.title === 'teal',
			'theme-tomato': theme.title === 'tomato',
			'theme-violet': theme.title === 'violet',
			'theme-yellow': theme.title === 'yellow',
			'theme-neutral': theme.title === 'neutral',
			'theme-zinc': theme.title === 'zinc',
			'theme-stone': theme.title === 'stone',
			'theme-soho': theme.title === 'soho',
			'theme-viva': theme.title === 'viva',
			'theme-ocean': theme.title === 'ocean',
			'current-theme': colorTheme === theme.title,
			'not-current-theme': colorTheme !== theme.title,
		}"
		:title="theme?.title"
		class="relative box-border flex h-7 w-7 min-w-7 min-h-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-105 hover:shadow-md"
		@click="setColorTheme(theme.title)"
	>
		<span
			class="w-full h-full rounded-full overflow-clip border-2"
		>
			<div
				class="rounded-full w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				style="
          transition: height 100ms ease 0s, width 100ms ease 0s;
          transform-origin: left top;
        "
			/>
		</span>
	</button>
</template>

<style lang="scss" scoped>
.current-theme {
	background-color: transparent;

	span {
		border-color: var(--color-theme-8);
		div {
			background-color: var(--color-theme-8);
		}
	}
}
.not-current-theme {
	background-color: var(--color-theme-8);
	span {
		border-color: transparent;
		div {
			background-color: var(--color-theme-8);
		}
	}
}
</style>
