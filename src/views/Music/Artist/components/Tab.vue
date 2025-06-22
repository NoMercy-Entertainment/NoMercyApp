<script setup lang="ts">
defineProps({
	isActive: {
		type: Boolean,
		default: false,
		required: true,
	},
});
</script>

<template>
	<div v-show="isActive" class="contents">
		<slot />
	</div>
</template>
