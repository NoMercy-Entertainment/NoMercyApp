<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { useToast } from 'primevue/usetoast';

import type { LibrariesResponse } from '@/types/api/base/library';

import router from '@/router';
import serverClient from '@/lib/clients/serverClient.ts';
import { translate } from '@/lib/stringArray.ts';
import { setLibraries } from '@/store/Libraries.ts';
import { setupComplete } from '@/store/ui.ts';
import { serverLibraries } from '@/store/servers.ts';

import Frame from './components/Frame.vue';
import Libraries from './partials/Libraries.vue';
import Finish from './partials/Finish.vue';
import Base from './partials/Base.vue';

const toast = useToast();

const steps = ref(['Base info', 'Media libraries', 'Finish']);

const currentStep = ref('Base info');
const nextButtonLocked = ref(false);

async function finish() {
	console.log('Finish');
	await serverClient()
		.post('/dashboard/libraries/refresh')
		.then(() => {
			toast.add({
				severity: 'success',
				summary: translate('Success'),
				detail: 'Your media libraries are being scanned in the background.',
				life: 16000,
			});
		})
		.catch((error) => {
			toast.add({
				severity: 'error',
				summary: 'Error refreshing libraries',
				detail: error.message,
				life: 16000,
			});
		});

	await serverClient()
		.get<{ data: LibrariesResponse[] }>('libraries')
		.then(({ data }) => {
			setLibraries(data.data);
			setupComplete.value = true;
			serverLibraries.value = true;
			router.replace('/');
		})
		.catch(() => {
			router.replace({ name: 'Server offline' });
		});
}

function setCurrentStep(step: string) {
	currentStep.value = step;
}

function setNextButtonLocked(value: boolean) {
	nextButtonLocked.value = value;
}

onMounted(() => {
	toast.add({
		severity: 'info',
		summary: translate('Info'),
		detail: translate('This is an informational message.'),
		life: 500000,
	});
	toast.add({
		severity: 'success',
		summary: translate('Success'),
		detail: translate('This is a success message.'),
		life: 500000,
	});
	toast.add({
		severity: 'warn',
		summary: translate('Warning'),
		detail: translate('This is a warning message.'),
		life: 500000,
	});
	toast.add({
		severity: 'error',
		summary: translate('Error'),
		detail: translate('This is an error message.'),
		life: 500000,
	});
	toast.add({
		severity: 'secondary',
		summary: translate('Secondary'),
		detail: translate('This is an secondary message.'),
		life: 500000,
	});
	toast.add({
		severity: 'contrast',
		summary: translate('Contrast'),
		detail: translate('This is an contrast message.'),
		life: 500000,
	});
	toast.add({
		severity: 'info',
		detail: translate('This is an informational message.'),
		life: 500000,
	});
	toast.add({
		severity: 'success',
		detail: translate('This is a success message.'),
		life: 500000,
	});
	toast.add({
		severity: 'warn',
		detail: translate('This is a warning message.'),
		life: 500000,
	});
	toast.add({
		severity: 'error',
		detail: translate('This is an error message.'),
		life: 500000,
	});
	toast.add({
		severity: 'secondary',
		detail: translate('This is an secondary message.'),
		life: 500000,
	});
	toast.add({
		severity: 'contrast',
		detail: translate('This is an contrast message.'),
		life: 500000,
	});
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<Frame
				:current-step="currentStep"
				:finish="finish"
				:next-button-locked="nextButtonLocked"
				:set-current-step="setCurrentStep"
				:steps="steps"
			>
				<Base v-if="currentStep === 'Base info'"
					:set-next-button-locked="setNextButtonLocked"
				/>

				<Libraries v-else-if="currentStep === 'Media libraries'"
					:set-next-button-locked="setNextButtonLocked"
				/>

				<Finish v-else-if="currentStep === 'Finish'"
					:set-next-button-locked="setNextButtonLocked"
				/>
			</Frame>
		</IonContent>
	</IonPage>
</template>
