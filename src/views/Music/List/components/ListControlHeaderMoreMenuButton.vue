<script lang="ts" setup>
import { MenuItem } from '@headlessui/vue';
import { useTranslation } from 'i18next-vue';
import type { FunctionalComponent, HTMLAttributes, PropType, VNodeProps } from 'vue';

const { t } = useTranslation();

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
		type: Function as PropType<FunctionalComponent<HTMLAttributes & VNodeProps>>,
		required: false,
	},
});

</script>

<template>
	<MenuItem v-slot="{ active }">
	<button :class="[
		active ? 'bg-[rgb(var(--color-focus,var(--color-theme-700))/80%)] text-contrast' : 'text-auto-900',
		'group items-center flex gap-2 text-contrast my-2 h-10 w-full notCurrentPage cursor-pointer rounded-md px-4 py-2 text-sm bg-auto-100',
	]" :onclick="onclick">
		<component :is="icon" v-if="icon" class="h-5 w-5"></component>
		{{ t(title) }}
	</button>
	</MenuItem>
</template>
