<script lang="ts" setup>

import { useRoute } from 'vue-router';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';

const route = useRoute();
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent :path="route.path" />
			</ScrollContainer>
</template>
