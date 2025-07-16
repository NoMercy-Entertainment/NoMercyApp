<script setup lang="ts">
import { background } from '@/store/ui.ts';
</script>

<template>
	<div v-if="!background" class="w-screen h-[100vw] -left-1/2 -top-full absolute opacity-50 blur-lg">
		<div class="w-full h-full rounded-full" style="background: radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, hsl(from rgb(var(--color-focus)) h s 20%) 0%, rgba(115, 115, 115, 0) 100%);" />
	</div>
</template>

<style scoped>

</style>
