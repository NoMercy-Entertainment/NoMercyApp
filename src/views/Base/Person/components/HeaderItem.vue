<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		required: true,
	},
	data: {
		type: String,
		required: false,
	},
});
</script>

<template>
	<div v-if="data || $slots" class="flex flex-col gap-2">
		<div class="flex gap-2">
			<p class="text-xs font-bold uppercase text-surface-10 leading-none">
				{{ $t(title) }}
			</p>
			<slot name="head" />
		</div>
		<div
			class="flex gap-1 items-center relative h-7 px-2 rounded-md border bg-surface-7/[0.1] border-slate-8/[0.3] dark:bg-surface-11/[0.1] dark:border-slate-11/[0.25] text-center w-min"
		>
			<slot v-if="$slots.default" />
			<p
				v-else
				class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center whitespace-nowrap"
			>
				{{ data }}
			</p>
		</div>
	</div>
</template>

<style scoped></style>
