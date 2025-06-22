<script setup lang="ts">
defineProps({
	route: {
		type: String,
		required: true,
	},
	line1: {
		type: String,
		required: true,
	},
	line2: {
		type: String,
		required: false,
	},
});
</script>

<template>
	<RouterLink
		:to="route"
		class="flex flex-grow flex-col items-center justify-end backdropCard min-w-available"
	>
		<slot name="image" />
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch p-3"
		>
			<div
				class="relative flex flex-grow flex-col items-start justify-center text-left overflow-clip w-available text-slate-light-12 dark:text-slate-dark-12"
			>
				<p
					class="w-auto flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold line-clamp-1"
				>
					{{ line1 }}
				</p>
				<p
					class="w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs line-clamp-1 text-slate-light-12/80 dark:text-slate-dark-12/80"
				>
					{{ line2 }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>
