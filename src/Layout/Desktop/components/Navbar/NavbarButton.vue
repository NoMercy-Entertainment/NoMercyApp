<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { RouterLink } from 'vue-router';

import type { MoooomIcons } from '@Icons/icons';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

const props = defineProps({
	href: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		required: true,
	},
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const classes = computed(() =>
	props.active
		? 'current-route bg-slate-light-3 text-slate-dark-4 hover:text-slate-dark-4 dark:bg-slate-light-3 dark:text-slate-light-4 dark:hover:text-slate-light-4 '
		+ 'shadow-[0_1px_0_0_rgba(0,0,0,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-2)/30%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-2)/60%)]  '
		+ 'hover:!shadow-[0_1px_0_0_rgba(0,0,0,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-2)/30%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-2)/60%)] '
		+ 'dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-1)/70%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-1)/30%)] '
		+ 'dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-1)/70%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-1)/30%)]'
		: '',
);

const styles = computed(() =>
	props.active
		? {
				background:
          'radial-gradient(50% 50% at 50% 100%, rgba(55, 55, 55, 0.09) 0%, rgba(55, 55, 55, 0.06) 40%, rgba(55, 55, 55, 0.00) 100%), linear-gradient(0deg, rgba(55, 55, 55, 0.00) 0%, rgba(255, 255, 255, 0.12) 100%), rgba(var(--background-auto-3) / 20%)',
				backgroundBlendMode: 'normal, overlay, normal',
			}
		: {},
);
</script>

<template>
	<RouterLink
		:to="href"
		:aria-label="$t(name)"
		class="flex relative justify-start items-center overflow-hidden rounded-md focus:bg-auto-12/4 hover:bg-focus/10 hover:text-auto-12 transition-colors duration-200 h-9 gap-1 px-2.5 py-1 lg:h-11 lg:gap-2 lg:px-3 lg:py-1.5 ripple-box"
		:class="classes"
		:style="styles"
	>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-nowrap items-center justify-start gap-3 text-xs md:text-base"
		>
			<OptimizedIcon :icon="icon" class="!w-5 lg:!w-6" />
			<p class="flex-shrink-0 flex-grow-0 text-base font-semibold">
				{{ $t(name) }}
			</p>
		</div>
	</RouterLink>
</template>
