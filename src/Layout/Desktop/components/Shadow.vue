<script lang="ts" setup>
import { background } from '@/store/ui.ts';
</script>

<template>
	<div v-if="!background" class="w-[90vw] h-[90vh] absolute opacity-60 dark:opacity-100 blur-3xl pointer-events-none bg-surface-3 -z-10">
		<div class="background w-full h-auto aspect-square rounded-full  -translate-x-1/3 -translate-y-[70%]" />
	</div>
</template>

<style scoped>
.background {
	background-image: radial-gradient(
		ellipse 50% 50% at 50% 50%,
		hsl(from theme('colors.theme.8') h 90% 50%) 0%,
		transparent 100%
	);
}
@media (prefers-color-scheme: dark) {
	html.scheme-system .background {
		background-image: radial-gradient(
			ellipse 50% 50% at 50% 50%,
			hsl(from theme('colors.theme.8') h 50% 40%) 0%,
			transparent 100%
		);
	}
}
html.scheme-dark .background {
	background-image: radial-gradient(
		ellipse 50% 50% at 50% 50%,
		hsl(from theme('colors.theme.8') h 50% 40%) 0%,
		transparent 100%
	);
}
</style>
