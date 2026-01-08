<script lang="ts" setup>
import { IonContent, IonPage } from '@ionic/vue';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent />
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
