<script lang="ts" setup>
import { MenuItem } from '@headlessui/vue';
import { useTranslation } from 'i18next-vue';
import type {
	FunctionalComponent,
	HTMLAttributes,
	PropType,
	VNodeProps,
} from 'vue';

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

const { t } = useTranslation();
</script>

<template>
	<MenuItem v-slot="{ active }">
		<button
			class="group items-center flex gap-2 my-2 h-10 w-full notCurrentPage cursor-pointer rounded-md px-4 py-2 text-sm bg-auto-100" :class="[
				active
					? 'bg-[rgb(var(--color-focus,var(--color-theme-700))/80%)]'
					: 'text-auto-900',
			]"
			:onclick="onclick"
		>
			<component :is="icon" v-if="icon" class="h-5 w-5" />
			{{ t(title) }}
		</button>
	</MenuItem>
</template>
