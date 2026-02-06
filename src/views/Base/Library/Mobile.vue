<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { setTitle } from '@/lib/utils/string';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

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
			<ScrollContainer :auto-hide="true" :static="true" class="!pb-5">
				<NMComponent />
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
