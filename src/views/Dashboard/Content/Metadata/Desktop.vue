<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ExploreContainer
				:name="`${router.currentRoute.value.name as string} Desktop page`"
			/>
		</IonContent>
	</IonPage>
</template>
