<script lang="ts" setup>
</script>

<template>
	<div
		class="animate-pulse bg-surface-12/3 hidden h-20 flex-shrink-0 flex-grow-0 flex-row items-center justify-between gap-4 self-stretch pr-6 rounded-lg m-2 mt-2 mb-4 pl-4 mx-5 sm:flex"
	>
		<!-- Left section: cover image and track info -->
		<div class="flex items-center gap-4 w-1/3">
			<div class="w-14 h-14 rounded bg-surface-5" />
			<div class="flex flex-col gap-2">
				<div class="w-32 h-4 rounded bg-surface-5" />
				<div class="w-24 h-3 rounded bg-surface-5" />
			</div>
		</div>

		<!-- Center section: playback controls -->
		<div class="flex flex-col items-center gap-2 w-1/3">
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-full bg-surface-5" />
				<div class="w-8 h-8 rounded-full bg-surface-5" />
				<div class="w-12 h-12 rounded-full bg-surface-5" />
				<div class="w-8 h-8 rounded-full bg-surface-5" />
				<div class="w-8 h-8 rounded-full bg-surface-5" />
			</div>
			<div class="w-full h-1 rounded bg-surface-5" />
		</div>

		<!-- Right section: volume and other controls -->
		<div class="flex items-center justify-end gap-2 w-1/3">
			<div class="w-8 h-8 rounded bg-surface-5" />
			<div class="w-8 h-8 rounded bg-surface-5" />
			<div class="w-8 h-8 rounded bg-surface-5" />
			<div class="w-24 h-2 rounded bg-surface-5" />
		</div>
	</div>
</template>
