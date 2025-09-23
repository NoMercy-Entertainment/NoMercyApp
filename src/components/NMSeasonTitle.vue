<script lang="ts" setup>
import type { PropType } from 'vue';
import type { SeasonTitleResponse } from '@/types/api/base/library';

defineProps({
	data: {
		type: Object as PropType<SeasonTitleResponse> | undefined,
		required: true,
	},
});
</script>

<template>
	<div v-if="data" class="season-title">
		<h2 class="text-2xl font-bold mt-2 -mb-2 flex gap-4 items-center ml-4">
			<span>{{ data.title }}</span>
			<span class="text-[hsl(from_var(--color-theme-8)_h_40%_70%)] text-sm leading-none">
				{{ data.episodeCount }} episodes
			</span>
		</h2>
	</div>
</template>

<style scoped>

</style>
