<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import type { MoooomIcons } from '@Icons/icons';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import sidebar from '@/store/sidebar';

defineProps({
	title: {
		type: String,
		required: true,
	},
	show: {
		type: Boolean,
		required: true,
	},
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: false,
	},
});

const { t } = useTranslation();

const open = ref<boolean>(true);

const toggle = () => (open.value = !open.value);

const classes = computed(
	() =>
		'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)]  hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)] dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)] '
		+ `${sidebar.value === 'open' ? 'flex' : 'flex sm:hidden'}`,
);
</script>

<template>
	<div
		v-if="show"
		class="flex h-auto w-full flex-col gap-1 transition-transform duration-200 handle"
	>
		<button
			class="relative h-10 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 self-stretch overflow-hidden rounded-md px-3 py-2 transition-transform duration-200 group hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
			:class="classes"
			@click="toggle"
		>
			<OptimizedIcon v-if="!!icon" :icon="icon!" class="" />
			<span
				class="relative flex flex-shrink-0 flex-grow items-center justify-start text-sm font-semibold"
			>
				{{ t(title) }}
			</span>
			<OptimizedIcon
				icon="chevronRight"
				:class="`transition-transform duration-200 ${
					open ? 'rotate-90' : 'rotate-0'
				}`"
			/>
		</button>

		<div
			:class="open || sidebar !== 'open' ? 'grid-rows-1' : 'grid-rows-0'"
			class="grid h-auto w-full grid-rows-1 transition-transform duration-200"
			:inert="!open"
		>
			<div
				class="flex flex-col gap-1 overflow-hidden transition-transform duration-200 p-0.5"
			>
				<slot />
			</div>
		</div>
	</div>
</template>
