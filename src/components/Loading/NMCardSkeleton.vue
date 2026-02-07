<script lang="ts" setup>
import { showBackdrops } from '@/store/preferences';
</script>

<template>
	<div
		:class="{
			'aspect-backdrop': showBackdrops,
			'aspect-poster': !showBackdrops,
		}"
		class="animate-pulse rounded-lg bg-surface-5 w-full"
	/>
</template>
