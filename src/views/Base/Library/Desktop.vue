<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
import { setBackground, setColorPalette, setTitle } from '@/store/ui.ts';

const route = useRoute();

onMounted(() => {
	setTitle();
	setBackground(null);
	setColorPalette(null);
});
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent :path="route.path" />
			</ScrollContainer>
</template>
