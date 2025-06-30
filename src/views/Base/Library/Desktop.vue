<script setup lang="ts">
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
import { watch } from 'vue';
import { setBackground, setColorPalette } from '@/store/ui.ts';

const route = useRoute();

watch(route, () => {
	setColorPalette(null);
	setBackground(null);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent :path="route.path" />
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
