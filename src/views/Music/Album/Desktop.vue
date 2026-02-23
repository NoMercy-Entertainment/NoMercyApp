<script setup lang="ts">

import ExploreContainer from '@/components/ExploreContainer.vue';
import router from '@/router';
</script>

<template>
			<ExploreContainer
				:name="`Album ${router.currentRoute.value.params.id} x Desktop page`"
			/>
</template>
