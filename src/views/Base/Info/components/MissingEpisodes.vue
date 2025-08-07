<script setup lang="ts">
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';

import Modal from '@/components/Modal.vue';
import NMComponent from '@/components/NMComponent.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
});

const route = useRoute();
</script>

<template>
	<Modal :open="open" :close="close" title="Missing Episodes" size="lg">
		<ScrollContainer :auto-hide="true" :static="true">
			<NMComponent :path="`${route.path}/missing`" />
		</ScrollContainer>
	</Modal>
</template>

<style scoped>

</style>
