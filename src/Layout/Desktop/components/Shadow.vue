<script setup lang="ts">
import { background } from '@/store/ui.ts';
</script>

<template>
	<div v-if="!background" class="w-screen h-[90vh] absolute opacity-40 dark:opacity-100 blur-lg pointer-events-none">
		<div class="background w-full h-auto aspect-square rounded-full  -translate-x-1/3 -translate-y-[70%]" />
	</div>
</template>

<style scoped>
.background {
	background: radial-gradient(
		ellipse 50% 50% at 50% 50%,
		hsl(from rgb(var(--color-focus)) h s 50%) 0%,
		rgb(var(--background-auto-1)) 100%
	);
}

html.scheme-dark .background {
	background: radial-gradient(
		ellipse 50% 50% at 50% 50%,
		hsl(from rgb(var(--color-focus)) h s 50%) 0%,
		rgb(from rgb(var(--background-auto-1)) r g b / 30%) 100%
	);
}
</style>
