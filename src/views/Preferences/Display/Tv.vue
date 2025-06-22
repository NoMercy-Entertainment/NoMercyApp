<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<ExploreContainer name="Display Tv page" />
		</IonContent>
	</IonPage>
</template>
