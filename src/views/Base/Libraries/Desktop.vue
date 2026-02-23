<script setup lang="ts">
import { watch } from 'vue';

import { setTitle } from '@/lib/utils/string';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

watch(route, () => {
	setTitle();
	setColorPalette(null);
	setBackground(null);
});
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true">
				<NMComponent />
			</ScrollContainer>
</template>
