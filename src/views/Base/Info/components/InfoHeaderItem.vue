<script setup lang="ts">
</script>

<template>
	<div
		class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-7 px-2 py-1 rounded-md bg-[#05294d]/[0.03] border-[#021c37]/[0.08] dark:bg-[#e2f0fd]/[0.08] border dark:border-[#dfeffe]/[0.14]"
	>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 px-1"
		>
			<p
				class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-slate-light-11 dark:text-slate-dark-11"
			>
				<slot />
			</p>
		</div>
	</div>
</template>
