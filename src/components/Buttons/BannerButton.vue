<script lang="ts" setup>
import type { PropType } from 'vue';
import Button from 'primevue/button';
import { buttonClasses } from '@/config/global.ts';
import { twMerge } from 'tailwind-merge';

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
	showDelay: {
		type: Number,
		required: false,
		default: 750,
	},
	hideDelay: {
		type: Number,
		required: false,
		default: 300,
	},
	noTip: {
		type: Boolean,
		required: false,
		default: false,
	},
});
</script>

<template>
	<Button
		v-if="href"
		v-tooltip.top="{
			showDelay,
			hideDelay,
			value: noTip ? null : $t(title),
		}"
		:aria-label="$t(title)"
		:class="{
			'text-focus': isActive,
			'text-surface-12/12': !isActive,
			[twMerge(buttonClasses, 'flex flex-nowrap w-max min-w-10')]: true,
		}"
		:to="href"
		:unstyled="true"
		as="RouterLink"
		tabindex="1"
		@click.prevent.stop="onclick?.($event)"
	>
		<slot />
	</Button>
	<Button
		v-else
		v-tooltip.top="{
			showDelay,
			hideDelay,
			value: noTip ? null : $t(title),
		}"
		:aria-label="$t(title)"
		:class="{
			'text-focus': isActive,
			'text-surface-12/12': !isActive,
			[twMerge(buttonClasses, 'flex flex-nowrap w-max min-w-10')]: true,
		}"
		:unstyled="true"
		label="Save"
		tabindex="1"
		@click.prevent.stop="onclick?.($event)"
	>
		<slot />
	</Button>
</template>
