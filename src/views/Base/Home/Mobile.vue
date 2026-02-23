<script setup lang="ts">

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true" class="!pb-5">
				<NMComponent />
			</ScrollContainer>
</template>
