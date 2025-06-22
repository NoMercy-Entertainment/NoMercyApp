<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout title="Notifications" :grid-style="2">
				<template #cta />
				<ExploreContainer
					:name="`${router.currentRoute.value.name as string} Desktop page`"
				/>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
