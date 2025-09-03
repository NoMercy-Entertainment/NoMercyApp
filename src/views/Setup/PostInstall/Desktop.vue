<script lang="ts" setup>
import { ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { useQueryClient } from '@tanstack/vue-query';

import Frame from './components/Frame.vue';

import Libraries from './partials/Libraries.vue';
import Finish from './partials/Finish.vue';
import Name from './partials/Name.vue';

import router from '@/router';
import serverClient from '@/lib/clients/serverClient.ts';
import { useToast } from 'primevue/usetoast';
import type { LibrariesResponse } from '@/types/api/base/library';
import { setLibraries } from '@/store/Libraries.ts';
import { setupComplete } from '@/store/ui.ts';
import { serverLibraries } from '@/store/servers.ts';

const toast = useToast();
const query = useQueryClient();

const steps = ref(['Name', 'Media libraries', 'Finish']);

const currentStep = ref('Name');
const nextButtonLocked = ref(false);

async function finish() {
	console.log('Finish');
	await serverClient()
		.post('/dashboard/libraries/refresh')
		.then(() => {
			toast.add({
				severity: 'success',
				summary: 'Scanning libraries',
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
				<Name v-if="currentStep === 'Name'"
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
