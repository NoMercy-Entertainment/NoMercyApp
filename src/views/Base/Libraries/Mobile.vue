<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';
import { setTitle } from '@/lib/stringArray';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';

const route = useRoute();

watch(route, () => {
	setTitle();
	setColorPalette(null);
	setBackground(null);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent path="/libraries/mobile" />
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
