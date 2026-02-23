<script setup lang="ts">

import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
</script>

<template>
			<ExploreContainer
				:name="`${router.currentRoute.value.name as string} Mobile page`"
			/>
</template>
