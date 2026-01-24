<script lang="ts" setup>
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	size: {
		type: Number,
		required: false,
		default: 256,
	},
});
</script>

<template>
	<div
		class="relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-xl bg-gradient-to-br shadow-lg from-theme-6 to-theme-9"
		style="padding: 10%"
	>
		<MoooomIcon
			class-name="size-64"
			icon="heart"
			style="--fill-color: white"
		/>
	</div>
</template>
