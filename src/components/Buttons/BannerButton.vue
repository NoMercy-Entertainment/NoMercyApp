<script lang="ts" setup>
import type { PropType } from 'vue';
import Button from 'primevue/button';

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
	<Button
		v-if="href"
		v-tooltip.top="{
			value: $t(title),
		}"
		:to="href"
		as="RouterLink"
		:unstyled="true"
		tabindex="1"
		:aria-label="$t(title)"
		class="grid relative place-content-center w-10 h-10 active:outline outline-focus focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-4 active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6"
		:class="{
			'text-focus': isActive,
			'text-auto-12': !isActive,
		}"
		@click.prevent.stop="() => onclick?.($event)"
	>
		<slot />
	</Button>
	<Button
		v-else
		v-tooltip.top="{
			value: $t(title),
		}"
		:unstyled="true"
		tabindex="1"
		:aria-label="$t(title)"
		class="grid relative place-content-center w-10 h-10 active:outline outline-focus focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-4 active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6"
		:class="{
			'text-focus': isActive,
			'text-auto-12': !isActive,
		}" label="Save"
		@click.prevent.stop="() => onclick?.($event)"
	>
		<slot />
	</Button>
</template>
