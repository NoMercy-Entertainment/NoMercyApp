<script lang="ts" setup>
import { computed, type PropType } from 'vue';

import type { ServerLibrary } from '@/types/server.ts';
import type { EncoderProfile } from '@/types/api/dashboard/server.ts';
import type { Language } from '@/types/api/shared';

import useServerClient from '@/lib/clients/useServerClient';

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

const { data: languages } = useServerClient<Language[]>({
	path: '/dashboard/configuration/languages',
});
// watch(languages, (value) => {
// 	if (!value)
// 		return;
// 	setLanguages(value);
// });

const { data: libraries } = useServerClient<ServerLibrary[]>({
	path: '/dashboard/libraries',
});
// watch(libraries, (value) => {
// 	if (!value)
// 		return;
// 	setServerLibraries(value);
// });

const { data: encoderProfiles } = useServerClient<EncoderProfile[]>({
	path: '/dashboard/encoderProfiles',
});
// watch(encoderProfiles, (value) => {
// 	if (!value)
// 		return;
// 	setEncoderProfiles(value);
// });
</script>

<template>
	<div class="mx-auto grid h-available place-content-center px-4 sm:px-6 lg:px-8">
		<div class="mx-auto w-screen max-w-6xl">
			<div
				:class="true ? 'animate-loading' : ''"
				class="w-full h-full gap-2.5 flex flex-col ml-auto overflow-hidden rounded-xl bg-slate-light-1 dark:bg-slate-dark-1 bg-cover border-2 border-transparent text-start transition-all duration-300"
				style="
					--bg-color: linear-gradient(rgb(var(--background-auto-3)), rgb(var(--background-auto-3)));
					--border-color: linear-gradient(var(--angle, 45deg),
						rgb(var(--color-focus) / 0.7) 0%,
						rgb(var(--color-focus) / 0.3) 33.33%,
						rgb(var(--color-focus) / 0.14) 66.67%,
						rgb(var(--color-focus) / 0.1) 100%
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

				<div class="mt-auto flex h-16 w-full justify-end gap-4 rounded-b-lg p-4 bg-slate-light-1/70 dark:bg-slate-dark-1/70">
					<Button v-if="!isFirstStep"
						id="yes"
						class="ml-auto !w-28"
						color="slate"
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
