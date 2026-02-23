<script setup lang="ts">
import { onMounted } from 'vue';
import { App } from '@capacitor/app';

import { clearTokens } from '@/lib/auth/index';

import ExploreContainer from '@/components/ExploreContainer.vue';

onMounted(async () => {
	clearTokens();
	setTimeout(() => {
		App.exitApp();
	}, 3000);
});
</script>

<template>
			<ExploreContainer name="Logging out..." />
</template>
