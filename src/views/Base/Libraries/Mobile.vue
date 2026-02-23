<script lang="ts" setup>

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true" class="!pb-5">
				<NMComponent :options="{ queryKey: ['libraries', 'mobile'] }" path="/libraries/mobile" />
			</ScrollContainer>
</template>
