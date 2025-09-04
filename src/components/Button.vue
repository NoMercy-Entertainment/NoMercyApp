<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { twMerge } from 'tailwind-merge';

import type { MoooomIcons } from '@Icons/icons';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

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
		'--color-1': `rgb(var(--color-${props.color}-1))`,
		'--color-2': `rgb(var(--color-${props.color}-2))`,
		'--color-3': `rgb(var(--color-${props.color}-3))`,
		'--color-4': `rgb(var(--color-${props.color}-4))`,
		'--color-5': `rgb(var(--color-${props.color}-5))`,
		'--color-6': `rgb(var(--color-${props.color}-6))`,
		'--color-7': `rgb(var(--color-${props.color}-7))`,
		'--color-8': `rgb(var(--color-${props.color}-8))`,
		'--color-9': `rgb(var(--color-${props.color}-9))`,
		'--color-10': `rgb(var(--color-${props.color}-10))`,
		'--color-11': `rgb(var(--color-${props.color}-11))`,
		'--color-12': `rgb(var(--color-${props.color}-12))`,
	};
});

const classes = computed(() => {
	return twMerge(
		props.className,
		'flex justify-center items-center px-4 py-2 gap-2 rounded-lg text-sm',
		'select-none w-auto font-semibold leading-[100%] transition-transform duration-150',
		props.className?.includes('h-') ? '' : 'h-9',
		props.variant === 'default' || props.variant === 'contained'
			? '!bg-gradient-to-b  from-[var(--color-9)] to-[var(--color-7)] hover:from-[var(--color-10)] hover:to-[var(--color-6)] active:from-[var(--color-9)] active:to-[var(--color-6)] dark:from-[var(--color-10)] dark:to-[var(--color-8)] dark:hover:from-[var(--color-11)] dark:hover:to-[var(--color-9)] dark:active:from-[var(--color-9)] dark:active:to-[var(--color-7)] button-filled !text-[var(--color-12)] shadow-lg'
			: '',
		props.variant === 'text'
			? 'hover:outline-[rgba(var(--color-7),.1)] hover:outline-1 hover:outline text-[rgb(var(--background-auto-10))]'
			: `
				 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-2)/60%)_inset,0_6px_10px_-4px_rgba(var(--background-auto-2)/70%)]
				 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-1)/30%)_inset,0_6px_10px_-4px_rgba(var(--background-auto-1)/70%)]

				 active:!shadow-none
				 active:!dark:shadow-none
			 `,
		props.variant === 'outlined'
			? 'text-[var(--color-7)] border-[var(--color-5)] border-2 focus-visible:border-[var(--color-6)] hover:border-[var(--color-7)] hover:bg-[rgba(var(--color-7),.1)]'
			: '',
		props.color
			? props.color === 'theme'
				? 'text-white'
				: props.color
			: 'text-[rgb(var(--background-auto-10))]',
		props.disabled ? 'grayscale cursor-not-allowed' : '',
	);
});
</script>

<template>
	<label
		v-if="component === 'label'"
		:id="id"
		:data-variant="variant"
		:for="htmlFor"
		:style="style"
		:class="classes"
		@click="onClick"
	>
		<OptimizedIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ title }}</span>
		</span>

		<OptimizedIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</label>
	<a
		v-else-if="component === 'link'"
		:id="id"
		:href="href"
		:data-variant="variant"
		:for="htmlFor"
		:style="style"
		:class="classes"
		@click="onClick"
	>
		<OptimizedIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ title }}</span>
		</span>

		<OptimizedIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</a>
	<button
		v-else
		:id="id"
		:data-variant="variant"
		:disabled="disabled"
		type="button"
		:style="
			color === 'theme'
				? {
					'--color-1': `rgb(var(--color-theme-1))`,
					'--color-2': `rgb(var(--color-theme-2))`,
					'--color-3': `rgb(var(--color-theme-3))`,
					'--color-4': `rgb(var(--color-theme-4))`,
					'--color-5': `rgb(var(--color-theme-5))`,
					'--color-6': `rgb(var(--color-theme-6))`,
					'--color-7': `rgb(var(--color-theme-7))`,
					'--color-8': `rgb(var(--color-theme-8))`,
					'--color-9': `rgb(var(--color-theme-9))`,
					'--color-10': `rgb(var(--color-theme-10))`,
					'--color-11': `rgb(var(--color-theme-11))`,
					'--color-12': `rgb(var(--color-theme-12))`,
				}
				: style
		"
		:class="classes"
		@click="onClick"
	>
		<OptimizedIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<slot v-if="$slots" />
			<span v-else-if="title">{{ title }}</span>
		</span>

		<OptimizedIcon v-if="endIcon" :icon="endIcon" class="-mr-1 w-5" />
	</button>
</template>
