<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import Stepper from './Stepper.vue';
import Button from '@/components/Button.vue';
import AppLogo from '@/components/Images/icons/AppLogo.vue';

const props = defineProps({
	steps: {
		type: Array as PropType<string[]>,
		required: true,
	},
	nextButtonLocked: {
		type: Boolean,
		default: false,
	},
	currentStep: {
		type: String,
		required: true,
	},
	setCurrentStep: {
		type: Function as PropType<(value: string) => void>,
		required: true,
	},
	finish: {
		type: Function as PropType<(value: boolean) => void>,
		required: true,
	},
});

const isFirstStep = computed(() => {
	return props.steps.findIndex(step => step === props.currentStep) === 0;
});
const isLastStep = computed(() => {
	return props.steps.findIndex(step => step === props.currentStep) === props.steps.length - 1;
});

function nextStep() {
	if (props.steps.findIndex(step => step === props.currentStep) < props.steps.length - 1) {
		props.setCurrentStep(props.steps[props.steps.findIndex(step => step === props.currentStep) + 1]);
	}
}

function previousStep() {
	if (props.steps.findIndex(step => step === props.currentStep) > 0) {
		props.setCurrentStep(props.steps[props.steps.findIndex(step => step === props.currentStep) - 1]);
	}
}
</script>

<template>
	<div class="mx-auto grid h-available place-content-center px-4 sm:px-6 lg:px-8 text-surface-12 z-10">
		<div class="mx-auto w-screen max-w-6xl">
			<div
				:class="true ? 'animate-loading' : ''"
				class="w-full h-full gap-2.5 flex flex-col ml-auto overflow-hidden rounded-xl bg-surface-1 dark:bg-surface-2 bg-cover border-2 border-transparent text-start transition-all duration-300"
				style="
					--bg-color: linear-gradient(rgb(var(--surface-2)), rgb(var(--surface-2)));
					--border-color: linear-gradient(var(--angle, 45deg),
						rgb(var(--color-theme-8) / 0.7) 0%,
						rgb(var(--color-theme-8) / 0.3) 33.33%,
						rgb(var(--color-theme-8) / 0.14) 66.67%,
						rgb(var(--color-theme-8) / 0.1) 100%
					);
				"
			>
				<div
					class="flex h-full w-full flex-col gap-4 overflow-hidden p-8 pb-0 min-h-[80vh] max-h-[80vh] h-available"
				>
					<div class="mx-auto h-44 w-auto p-2">
						<AppLogo class="pb-8" />
					</div>

					<Stepper :current-step="currentStep" :steps="steps" />

					<div class="overflow-hidden p-4 h-available">
						<slot />
					</div>
				</div>

				<div
					class="mt-auto flex h-16 w-full justify-end gap-4 rounded-b-lg p-4"
				>
					<Button v-if="!isFirstStep"
						id="yes"
						class="ml-auto !w-28"
						color="contrast"
						type="button"
						variant="text"
						@click="previousStep"
					>
						{{ $t('Back') }}
					</Button>
					<Button v-if="isLastStep"
						id="cancel"
						:disabled="nextButtonLocked"
						class="!w-28"
						color="theme"
						type="button"
						variant="default"
						@click="finish"
					>
						{{ $t('Finish') }}
					</button>
					<Button v-else
						id="save"
						:disabled="nextButtonLocked"
						class="!w-28"
						color="theme"
						type="button"
						variant="default"
						@click="nextStep"
					>
						{{ $t('Next') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
