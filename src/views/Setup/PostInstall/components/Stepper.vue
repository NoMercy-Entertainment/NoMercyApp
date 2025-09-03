<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

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

const { t } = useTranslation();

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
		<h4 class="text-xl font-bold text-contrast">
			{{ $t(currentStep) }}
		</h4>
		<div aria-hidden="true" class="mt-4">
			<div class="overflow-hidden rounded-full bg-gray-200">
				<div :style="`width: ${percentage}%`" class="h-1 rounded-full bg-theme-600" />
			</div>
			<div :style="`grid-template-columns: repeat(${steps.length}, minmax(0, 1fr))`"
				class="mt-6 hidden text-sm font-medium text-auto-600 sm:grid"
			>
				<div v-for="step in steps" :key="step" class="text-center">
					{{ $t(step) }}
				</div>
			</div>
		</div>
	</div>
</template>
