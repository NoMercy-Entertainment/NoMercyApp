<script lang="ts" setup>

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent />
			</ScrollContainer>
</template>
