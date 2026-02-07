<template>
	<div class="grid justify-start items-center self-stretch rounded-lg px-2 sm:py-1 home-grid gap-2">
		<span class="flex w-10 h-10 justify-center items-center">
			<div class="h-4 w-4 animate-pulse rounded bg-surface-5" />
		</span>

		<span class="flex sm:h-12 items-center gap-4 overflow-hidden">
			<div class="hidden sm:block h-10 w-10 min-w-[2.5rem] animate-pulse rounded bg-surface-5" />
			<span class="flex flex-col gap-1.5">
				<div class="h-4 w-36 animate-pulse rounded bg-surface-5" />
				<div class="h-3 w-24 animate-pulse rounded bg-surface-4" />
			</span>
		</span>

		<span class="hidden sm:flex items-center">
			<div class="h-4 w-28 animate-pulse rounded bg-surface-5" />
		</span>

		<span class="hidden sm:flex items-center justify-between gap-2">
			<div class="h-4 w-4 animate-pulse rounded bg-surface-4" />
			<div class="h-4 w-10 animate-pulse rounded bg-surface-5" />
		</span>

		<span class="flex items-center mx-3">
			<div class="h-5 w-5 animate-pulse rounded bg-surface-4" />
		</span>
	</div>
</template>
