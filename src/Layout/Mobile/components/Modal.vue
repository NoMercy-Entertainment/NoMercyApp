<script setup lang="ts">
import { IonButton, IonButtons, IonContent, modalController } from '@ionic/vue';
</script>

<template>
	<IonContent :fullscreen="true" class="ion-padding">
		<IonButtons>
			<IonButton @click="modalController.dismiss(null, 'cancel')">
				Close
			</IonButton>
		</IonButtons>
	</IonContent>
</template>

<style scoped></style>
