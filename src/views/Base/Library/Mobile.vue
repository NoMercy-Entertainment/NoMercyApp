<script setup lang="ts">

import { setTitle } from '@/lib/utils/string';
import { setBackground, setColorPalette } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NMComponent from '@/components/NMComponent.vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

watch(route, () => {
	setTitle();
	setColorPalette(null);
	setBackground(null);
});
</script>

<template>
			<ScrollContainer :auto-hide="true" :static="true" class="!pb-5">
				<NMComponent :path="route.path" />
			</ScrollContainer>
</template>
