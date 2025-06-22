<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';

import ServerSystemInfoCard from './Components/ServerSystemInfoCard.vue';
import ServerTasksCard from './Components/ServerTasksCard/ServerTasksCard.vue';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout title="Dashboard overview" :grid-style="3">
				<ServerSystemInfoCard />

				<ServerTasksCard />
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
