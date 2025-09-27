<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

import type { MoooomIcons } from '@Icons/icons';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	variant: {
		type: String as PropType<
			| 'primary'
			| 'contained'
			| 'text'
			| 'outlined'
			| 'default'
			| 'hover'
			| 'active'
			| 'focussed'
			| 'disabled'
			| 'auto'
		>,
		default: 'default',
		required: false,
	},
	onClick: {
		type: Function as PropType<(e: Event) => void>,
		required: false,
	},
	title: {
		type: String,
		default: '',
		required: false,
	},
	className: {
		type: String,
		default: '',
		required: false,
	},
	color: {
		type: String,
		default: 'gray',
		required: false,
	},
	htmlFor: {
		type: String,
		default: '',
		required: false,
	},
	href: {
		type: String,
		default: '',
		required: false,
	},
	disabled: {
		type: Boolean,
		default: false,
		required: false,
	},
	startIcon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: false,
	},
	endIcon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: false,
	},
	component: {
		type: String as PropType<'button' | 'label' | 'link'>,
		default: 'button',
		required: false,
	},
});

const style = computed(() => {
	return {
		'--color-1': `var(--color-${props.color}-1)`,
		'--color-2': `var(--color-${props.color}-2)`,
		'--color-3': `var(--color-${props.color}-3)`,
		'--color-4': `var(--color-${props.color}-4)`,
		'--color-5': `var(--color-${props.color}-5)`,
		'--color-6': `var(--color-${props.color}-6)`,
		'--color-7': `var(--color-${props.color}-7)`,
		'--color-8': `var(--color-${props.color}-8)`,
		'--color-9': `var(--color-${props.color}-9)`,
		'--color-10': `var(--color-${props.color}-10)`,
		'--color-11': `var(--color-${props.color}-11)`,
		'--color-12': `var(--color-${props.color}-12)`,
	};
});

const classes = computed(() => {
	return twMerge(
		props.className,
		'flex justify-center items-center px-4 py-2 gap-2 rounded-lg text-sm',
		'select-none w-auto font-semibold leading-[100%]',
		props.className?.includes('h-') ? '' : 'h-9',
		props.variant === 'default' || props.variant === 'contained'
			? `!bg-gradient-to-b dark:!bg-gradient-to-t
        from-[var(--color-6)] to-[var(--color-4)]
        hover:from-[var(--color-7)] hover:to-[var(--color-9)]
        active:from-[var(--color-7)] active:to-[var(--color-9)]
			  button-filled text-[var(--color-12)] hover:text-[var(--color-1)] dark:hover:text-[var(--color-12)] shadow-lg`
			: '',
		props.variant === 'text'
			? 'outline-transparent hover:outline-[rgb(from_var(--color-5)_r_g_b/80%)] hover:outline-1 hover:outline text-[rgb(from_var(--background-contrast-12)_r_g_b/80%)]'
			: `
				 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
				 dark:shadow-none

				 active:!shadow-none
				 active:!dark:shadow-none
			 `,
		props.variant === 'outlined'
			? 'text-[var(--color-7)] border-[var(--color-5)] border-2 focus-visible:border-[var(--color-6)] hover:border-[var(--color-7)] hover:bg-[rgba(var(--color-7),.1)]'
			: '',
		props.color && props.variant !== 'default' && props.variant !== 'contained'
			? props.color === 'theme'
				? 'text-white'
				: props.color
			: '',
		props.disabled ? 'grayscale cursor-not-allowed' : '',
	);
});
</script>

<template>
	<label
		v-if="component === 'label'"
		:id="id"
		:class="classes"
		:data-variant="variant"
		:for="htmlFor"
		:style="style"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ title }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</label>
	<a
		v-else-if="component === 'link'"
		:id="id"
		:class="classes"
		:data-variant="variant"
		:for="htmlFor"
		:href="href"
		:style="style"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ title }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</a>
	<button
		v-else
		:id="id"
		:class="classes"
		:data-variant="variant"
		:disabled="disabled"
		:style="
			color === 'theme'
				? {
					'--color-1': `var(--color-theme-1)`,
					'--color-2': `var(--color-theme-2)`,
					'--color-3': `var(--color-theme-3)`,
					'--color-4': `var(--color-theme-8)`,
					'--color-5': `var(--color-theme-5)`,
					'--color-6': `var(--color-theme-6)`,
					'--color-7': `var(--color-theme-7)`,
					'--color-8': `var(--color-theme-8)`,
					'--color-9': `var(--color-theme-9)`,
					'--color-10': `var(--color-theme-10)`,
					'--color-11': `var(--color-theme-11)`,
					'--color-12': `var(--color-theme-12)`,
				}
				: style
		"
		type="button"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<slot v-if="$slots" />
			<span v-else-if="title">{{ title }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</button>
</template>
