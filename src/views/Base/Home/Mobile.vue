<script setup lang="ts">
import { onMounted } from 'vue';

import { setTitle } from '@/lib/utils/string';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';

onMounted(() => {
	setTitle();
	setBackground(null);
	setColorPalette(null);
});
</script>

<template>
	<ScrollContainer :auto-hide="true" :static="true" class="pb-2">
		<NMComponent />
	</ScrollContainer>
</template>
