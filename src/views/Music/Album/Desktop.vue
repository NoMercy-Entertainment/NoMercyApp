<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ExploreContainer
				:name="`Album ${router.currentRoute.value.params.id} x Desktop page`"
			/>
		</IonContent>
	</IonPage>
</template>
