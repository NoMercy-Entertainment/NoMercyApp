<script setup lang="ts">
import { computed } from 'vue';

import { getColorFromPercent, greenToRed } from '@/lib/colorHelper';
import { usePercentageColors } from '@/store/preferences';

const props = defineProps({
	cpu: {
		type: Number,
		required: true,
		default: 0,
	},
	value: {
		type: Number,
		required: true,
		default: 0,
	},
});

const color = computed(() => {
	if (usePercentageColors.value)
		return getColorFromPercent(props.value, greenToRed);

	return 'rgb(var(--color-focus))';
});
</script>

<template>
	<div
		class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch text-slate-light-11/80 dark:text-slate-dark-11/80"
	>
		<div
			class="flex flex-grow flex-col items-start justify-start gap-1 text-left"
		>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch"
			>
				<p class="w-8 flex-shrink-0 flex-grow-0 text-sm">
					{{ cpu }}
				</p>
				<div class="relative h-2 flex-grow rounded-lg">
					<div
						class="absolute h-2 w-full rounded left-[-1px] top-[-1px] bg-auto-2 dark:bg-auto-1"
					/>
					<div
						class="absolute h-2 rounded transition-all duration-500 left-[-1px] top-[-1px]"
						:style="{
							width: `${value}%`,
							backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 100%)`,
						}"
					/>
				</div>
				<p class="w-10 flex-shrink-0 flex-grow-0 text-right text-sm">
					{{ Math.floor(value) }}%
				</p>
			</div>
		</div>
	</div>
</template>
