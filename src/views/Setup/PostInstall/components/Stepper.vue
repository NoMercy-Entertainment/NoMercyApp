<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

const props = defineProps({
	steps: {
		type: Array as PropType<string[]>,
		required: true,
	},
	currentStep: {
		type: String,
		required: true,
	},
});

const currentStepIndex = computed(() => {
	if (!props.steps)
		return 0;

	return props.steps?.indexOf(props.currentStep);
});

const percentage = computed(() => {
	if (!props.steps)
		return 0;

	return (currentStepIndex.value + 1) / props.steps.length * 100;
});
</script>

<template>
	<div class="-mt-12 px-4">
		<h4 class="text-xl font-bold">
			{{ $t(currentStep) }}
		</h4>
		<div aria-hidden="true" class="mt-4">
			<div class="overflow-hidden rounded-full bg-surface-11">
				<div :style="`width: ${percentage}%`" class="h-1 rounded-full bg-focus transition-all duration-300" />
			</div>
			<div :style="`grid-template-columns: repeat(${steps.length}, minmax(0, 1fr))`"
				class="mt-6 hidden text-sm font-medium text-surface-12/12 sm:grid"
			>
				<div v-for="step in steps" :key="step" class="text-center font-semibold">
					{{ $t(step) }}
				</div>
			</div>
		</div>
	</div>
</template>
