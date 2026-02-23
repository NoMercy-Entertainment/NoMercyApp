<script setup lang="ts">

import ServerSystemInfoCard from './Components/ServerSystemInfoCard.vue';
import ServerTasksCard from './Components/ServerTasksCard/ServerTasksCard.vue';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
</script>

<template>
			<DashboardLayout title="Dashboard overview" :grid-style="3">
				<ServerSystemInfoCard />

				<ServerTasksCard />
			</DashboardLayout>
</template>
