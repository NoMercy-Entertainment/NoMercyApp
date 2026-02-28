<script setup lang="ts">
const emit = defineEmits<{
	(e: 'close'): void;
}>();
</script>

<template>
	<div class="flex flex-col h-full p-4">
		<div class="flex justify-end">
			<button
				class="px-4 py-2 text-sm font-medium rounded-lg bg-surface-3 text-surface-12 active:bg-surface-4 transition-colors"
				@click="emit('close')"
			>
				Close
			</button>
		</div>
		<slot />
	</div>
</template>
