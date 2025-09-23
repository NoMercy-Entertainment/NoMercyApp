<script lang="ts" setup>
import { watch } from 'vue';
import { useToggle } from '@vueuse/core';

import { setShowBackdrops, showBackdrops } from '@/store/preferences';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

const [value] = useToggle(showBackdrops.value);

watch(value, (newVal) => {
	setShowBackdrops(newVal);
});
</script>

<template>
	<div class="mb-8 flex select-none flex-col gap-3">
		<div class="flex items-center justify-between">
			<p class="font-bold">
				{{ $t("Card style") }}
			</p>
		</div>
		<div
			class="relative mr-2 flex h-12 items-center justify-between rounded-lg border-4 border-transparent py-2 ring-1 transition-transform duration-200 bg-surface-5/5 ring-surface-12/6"
		>
			<div
				:class="value ? 'translate-x-full' : ''"
				class="absolute z-0 h-10 w-1/2 transition-all duration-200 bg-gradient-to-b rounded-[4px] button-filled from-[var(--surface-8)] dark:from-[var(--surface-4)] to-[var(--surface-7)] dark:to-[var(--surface-2)] shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-2)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-2)_r_g_b/70%)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-2)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-2)_r_g_b/70%)]"
			/>
			<button
				class="pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-4 py-1"
				@click="() => (value = false)"
			>
				<span class="flex h-5 w-5 items-center">
					<OptimizedIcon class="h-5 w-5" icon="portrait" />
				</span>
				<span>Poster</span>
			</button>
			<button
				class="pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-5 py-1"
				@click="() => (value = true)"
			>
				<span class="flex h-5 w-5 items-center">
					<OptimizedIcon class="h-5 w-5" icon="landscape" />
				</span>
				<span>Backdrop</span>
			</button>
		</div>
	</div>
</template>
