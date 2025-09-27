<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { MoooomIcons } from '@Icons/icons';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
		? 'current-route bg-surface-8 text-surface-12 '
		+ 'shadow-[0_1px_0_0_rgba(0,0,0,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-3)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-3)_r_g_b/60%)]  '
		+ 'hover:!shadow-[0_1px_0_0_rgba(0,0,0,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-3)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-3)_r_g_b/60%)] '
		+ 'dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-3)_r_g_b/70%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-3)_r_g_b/30%)] '
		+ 'dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--surface-3)_r_g_b/70%)_inset,0_22px_30px_-4px_rgb(from_var(--surface-3)_r_g_b/30%)]'
		: '',
);

const styles = computed(() =>
	props.active
		? {
				background:
              'radial-gradient(50% 50% at 50% 100%, rgba(55, 55, 55, 0.09) 0%, rgba(55, 55, 55, 0.06) 40%, rgba(55, 55, 55, 0.00) 100%), linear-gradient(180deg, rgba(55, 55, 55, 0.00) 0%, rgba(255, 255, 255, 0.12) 100%), rgb(from var(--surface-12) r g b / 15%)',
				backgroundBlendMode: 'normal, overlay, normal',
			}
		: {},
);
</script>

<template>
	<RouterLink
		:aria-label="$t(name)"
		:class="classes"
		:style="styles"
		:to="href"
		class="flex relative justify-start items-center overflow-hidden rounded-md focus:bg-surface-3/4 hover:bg-focus/10 transition-colors duration-200 h-9 gap-1 px-2.5 py-1 lg:h-11 lg:gap-2 lg:px-3 lg:py-1.5 ripple-box"
	>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-nowrap items-center justify-start gap-3 text-xs md:text-base"
		>
			<MoooomIcon :icon="icon" class="!w-5 lg:!w-6" />
			<p class="flex-shrink-0 flex-grow-0 text-base font-semibold">
				{{ $t(name) }}
			</p>
		</div>
	</RouterLink>
</template>
