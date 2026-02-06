<script setup lang="ts">
defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div v-if="isActive" class="contents">
		<slot />
	</div>
</template>
