<script lang="ts" setup>
import { ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';

import Frame from './components/Frame.vue';

import Libraries from './partials/Libraries.vue';
import Finish from './partials/Finish.vue';
import Name from './partials/Name.vue';

import router from '@/router';

const steps = ref(['Name', 'Media libraries', 'Finish']);

const currentStep = ref('Name');
const nextButtonLocked = ref(false);

function finish() {
	console.log('Finish');
	router.replace('/');
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
