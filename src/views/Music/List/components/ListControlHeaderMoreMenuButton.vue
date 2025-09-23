<script lang="ts" setup>
import { MenuItem } from '@headlessui/vue';

import type { FunctionalComponent, HTMLAttributes, PropType, VNodeProps } from 'vue';

defineProps({
	title: {
		type: String as PropType<string>,
		required: true,
	},
	onclick: {
		type: Function as PropType<() => void>,
		required: true,
	},
	icon: {
		type: Function as PropType<
			FunctionalComponent<HTMLAttributes & VNodeProps>
		>,
		required: false,
	},
});
</script>

<template>
	<MenuItem v-slot="{ active }">
		<button
			:class="[
				active
					? 'bg-[rgb(var(--color-theme-8,var(--color-theme-700))/80%)]'
					: 'text-surface-900',
			]" :onclick="onclick"
			class="group items-center flex gap-2 my-2 h-10 w-full notCurrentPage cursor-pointer rounded-md px-4 py-2 text-sm bg-surface-20"
		>
			<component :is="icon" v-if="icon" class="h-5 w-5" />
			{{ $t(title) }}
		</button>
	</MenuItem>
</template>
