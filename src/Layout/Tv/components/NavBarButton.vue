<script lang="ts" setup>
import type { PropType } from 'vue';
import type { MoooomIcons } from '@Icons/icons';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: true,
	},
	href: {
		type: String,
		required: false,
		default: '/',
	},
	name: {
		type: String,
		required: false,
		default: '',
	},
	active: {
		type: Boolean,
		required: false,
		default: false,
	},
});
</script>

<template>
	<RouterLink
		:class="{
			'bg-focus/80': active,
			'bg-white/10': !active,
		}"
		:to="href"
		class="flex justify-center items-center relative first:children:mt-0.5 gap-2 pl-2 pr-3 h-8 rounded-3xl focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline text-surface-12"
		tabindex="1"
	>
		<OptimizedIcon :icon="icon" class-name="size-5 relative" />
		<p
			class="flex-grow-0 flex-shrink-0 text-xs text-left leading-none mt-0.5"
		>
			{{ $t(name) }}
		</p>
	</RouterLink>
</template>

<style scoped></style>
