<script setup lang="ts">

import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
	size: {
		type: Number,
		required: false,
		default: 256,
	},
});

</script>

<template>
	<div class="relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-xl bg-gradient-to-br text-white shadow-lg bg-theme-6 from-theme-6 via-theme-9 to-theme-12"
		style="padding:15%">
		<OptimizedIcon icon="heart" className="h-60 w-60" style="--fill-color: white;" />
	</div>
</template>
