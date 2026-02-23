<script lang="ts" setup>

import router from '@/router';

import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
			<ExploreContainer
				:name="`${router.currentRoute.value.name as string} Mobile page`"
			/>
</template>
