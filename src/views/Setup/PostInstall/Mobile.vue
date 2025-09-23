<script lang="ts" setup>
import { IonContent, IonPage } from '@ionic/vue';

import router from '@/router';

import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ExploreContainer
				:name="`${router.currentRoute.value.name as string} Mobile page`"
			/>
		</IonContent>
	</IonPage>
</template>
