<script setup lang="ts">
import { computed, h, onMounted, ref, shallowRef } from 'vue';
import { $t } from '@primeuix/styled';
import { currentServer } from '@/store/currentServer';

// Props
const props = defineProps({
	url: {
		type: String,
		required: true,
	},
});

// @ts-ignore
window.h = h;

// State variables
const dynamicComponent = shallowRef(null);
const loading = ref(true);
const url = computed(
	() => `${currentServer.value?.serverBaseUrl}/transcode/${props.url}`,
);

async function loadComponent() {
	try {
		const module = await import(/* @vite-ignore */ url.value);

		dynamicComponent.value = module.default;
	}
	catch (error) {
		console.error('Error loading component:', error);
	}
	finally {
		loading.value = false;
	}
}

onMounted(loadComponent);
</script>

<template>
	<div>
		<component
			:is="dynamicComponent"
			v-if="dynamicComponent"
			mark-raw
		/>
		<p v-else-if="loading">
			{{ $t("Loading component") }}...
		</p>
		<p v-else>
			{{ $t("Failed to load component") }}.
		</p>
	</div>
</template>

<style scoped></style>
