<script lang="ts" setup>
import { onMounted } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { setTitle } from '@/lib/stringArray';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';

onMounted(() => {
	setTitle();
	setBackground(null);
	setColorPalette(null);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent path="/music/start" />
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
