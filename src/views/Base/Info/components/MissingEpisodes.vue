<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { queryClient } from '@/config/tanstack-query';
import Modal from '@/components/Modal.vue';
import NMComponent from '@/components/NMComponent.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
});

const route = useRoute();
const queryKey = computed(() => {
	const key = `${route.path}/missing`.split('/');
	key[0] = 'base';

	return key;
});

const refreshing = ref(false);

function refresh() {
	refreshing.value = true;
	queryClient.invalidateQueries({ queryKey: queryKey.value }).finally(() => {
		refreshing.value = false;
	});
}

watch(() => props.open, (isOpen) => {
	if (isOpen) {
		queryClient.invalidateQueries({ queryKey: queryKey.value });
	}
});
</script>

<template>
	<Modal :open="open" :close="close" title="Missing episodes" max-width="max-w-7xl">
		<ScrollContainer :auto-hide="true" :static="true">
			<NMComponent
				:path="`${route.path}/missing`"
				:options="{
					queryKey,
				}"
			/>
		</ScrollContainer>
		<template #actions>
			<button
				:disabled="refreshing"
				class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-5 hover:bg-surface-6 text-surface-12 text-sm transition-colors"
				@click="refresh"
			>
				<svg
					:class="{ 'animate-spin': refreshing }"
					class="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				{{ $t('Refresh') }}
			</button>
		</template>
	</Modal>
</template>
