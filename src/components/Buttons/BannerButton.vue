<script lang="ts" setup>
import type { PropType } from 'vue';
import Button from 'primevue/button';
import { buttonClasses } from '@/config/global.ts';

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
		:aria-label="$t(title)"
		:class="{
			'text-focus': isActive,
			'text-surface-12/12': !isActive,
			[buttonClasses]: true,
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
			value: $t(title),
		}"
		:aria-label="$t(title)"
		:class="{
			'text-focus': isActive,
			'text-surface-12/12': !isActive,
			[buttonClasses]: true,
		}"
		:unstyled="true"
		label="Save"
		tabindex="1"
		@click.prevent.stop="onclick?.($event)"
	>
		<slot />
	</Button>
</template>
