<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
	title: {
		type: String,
		required: true,
	},
	href: {
		type: String,
		required: false,
	},
	isActive: {
		type: Boolean,
		required: false,
		default: false,
	},
	onclick: {
		type: Function as PropType<(e: Event) => void>,
		required: false,
	},
});
</script>

<template>
	<RouterLink
		v-if="href"
		:to="href"
		:aria-label="$t(title)"
		:onclick="onclick"
		:class="`grid relative place-content-center w-10 h-10 active:outline outline-focus focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-2/[1%] active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6 ${
			isActive ? 'text-focus' : 'text-auto-12'
		}`"
	>
		<slot />
	</RouterLink>
	<button
		v-else
		:aria-label="$t(title)"
		:onclick="onclick"
		:class="`grid relative place-content-center w-10 h-10 active:outline outline-focus focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-2/[1%] active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6 ${
			isActive ? 'text-focus' : 'text-auto-12'
		}`"
	>
		<slot />
	</button>
</template>
