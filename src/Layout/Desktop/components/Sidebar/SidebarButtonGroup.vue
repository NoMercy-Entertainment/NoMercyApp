<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

import type { MoooomIcons } from '@Icons/icons';
import sidebar from '@/store/sidebar';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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

const open = ref<boolean>(true);

const toggle = () => (open.value = !open.value);

const classes = computed(
	() =>
		'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-9)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-9)_r_g_b/70%)]  hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-11)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-11)_r_g_b/70%)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)] dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)] '
		+ `${sidebar.value === 'open' ? 'flex' : 'flex sm:hidden'}`,
);
</script>

<template>
	<div
		v-if="show"
		class="flex h-auto w-full flex-col gap-1 transition-transform duration-200 handle"
	>
		<button
			:class="classes"
			class="relative h-10 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 self-stretch overflow-hidden rounded-md px-3 py-2 transition-transform duration-200 group hover:bg-surface-2/60"
			@click="toggle"
		>
			<MoooomIcon v-if="!!icon" :icon="icon!" class="" />
			<span
				class="relative flex flex-shrink-0 flex-grow items-center justify-start text-sm font-semibold"
			>
				{{ $t(title) }}
			</span>
			<MoooomIcon
				:class="`transition-transform duration-200 ${
					open ? 'rotate-90' : 'rotate-0'
				}`"
				icon="chevronRight"
			/>
		</button>

		<div
			:class="open || sidebar !== 'open' ? 'grid-rows-1' : 'grid-rows-0'"
			:inert="!open"
			class="grid h-auto w-full grid-rows-1 transition-all duration-200"
		>
			<div
				class="flex flex-col gap-1 overflow-hidden px-0.5 mt-0.5"
			>
				<slot />
			</div>
		</div>
	</div>
</template>
