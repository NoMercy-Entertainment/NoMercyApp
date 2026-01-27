<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, useAttrs } from 'vue';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import type { MoooomIcons } from '@Icons/icons';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	variant: {
		type: String as PropType<ButtonVariants['variant']>,
		default: 'default',
		required: false,
	},
	size: {
		type: String as PropType<ButtonVariants['size']>,
		default: 'md',
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

const buttonVariants = cva(
	// Base classes
	'flex justify-center items-center px-4 py-2 gap-2 rounded-lg text-sm select-none w-auto font-semibold leading-[100%]',
	{
		variants: {
			variant: {
				default: `
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,
				contained: `
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,
				text: `
					outline-transparent hover:outline-[rgb(from_var(--color-5)_r_g_b/80%)]
					hover:outline-1 hover:outline text-[rgb(from_var(--background-contrast-12)_r_g_b/80%)]
				`,
				outlined: `
					text-[var(--color-7)] border-[var(--color-5)] border-2
					focus-visible:border-[var(--color-6)] hover:border-[var(--color-7)]
					hover:bg-[rgba(var(--color-7),.1)]
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,
				primary: `
					!bg-gradient-to-b dark:!bg-gradient-to-b
					from-[var(--color-6)] to-[var(--color-7)]
					hover:from-[var(--color-5)] hover:to-[var(--color-6)]
					active:from-[var(--color-7)] active:to-[var(--color-8)]
					button-filled text-[var(--color-1)]
					shadow-lg
					shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--surface-2)_r_g_b/60%)_inset,0_6px_10px_-4px_rgba(from_var(--surface-2)_r_g_b/70%)]
					dark:shadow-none active:!shadow-none active:!dark:shadow-none
				`,
			},
			size: {
				sm: 'h-8 text-xs px-3',
				md: 'h-9 text-sm px-4',
				lg: 'h-12 text-base px-6',
			},
			disabled: {
				true: 'grayscale !cursor-not-allowed',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			disabled: false,
		},
	},
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const attrs = useAttrs();

const style = computed(() => {
	const base = `var(--color-${props.color}-8)`;
	return {
		'--color-1': `hsl(from ${base} h s 97%)`,
		'--color-2': `hsl(from ${base} h s 93%)`,
		'--color-3': `hsl(from ${base} h s 88%)`,
		'--color-4': `hsl(from ${base} h s 80%)`,
		'--color-5': `hsl(from ${base} h s 70%)`,
		'--color-6': `hsl(from ${base} h s 60%)`,
		'--color-7': `hsl(from ${base} h s 50%)`,
		'--color-8': base,
		'--color-9': `hsl(from ${base} h s 35%)`,
		'--color-10': `hsl(from ${base} h s 25%)`,
		'--color-11': `hsl(from ${base} h s 15%)`,
		'--color-12': `hsl(from ${base} h s 5%)`,
		...(attrs.style as object || {}),
	};
});

const passedClass = computed(() => (attrs.class as string) || '');

const classes = computed(() => {
	// Check if passedClass has height class
	const hasHeightClass = /\bh-\d+\b/.test(passedClass.value);

	return buttonVariants({
		variant: props.variant,
		size: hasHeightClass ? undefined : props.size,
		disabled: props.disabled,
		className: passedClass.value,
	});
});

const filteredAttrs = computed(() => {
	const { class: _, style: __, ...rest } = attrs;
	return rest;
});
</script>

<template>
	<label
		v-if="component === 'label'"
		:id="id"
		:class="classes"
		:data-variant="variant"
		:for="htmlFor"
		:inert="disabled"
		:style="style"
		v-bind="filteredAttrs"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ $t(title) }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="w-5" />
	</label>
	<a
		v-else-if="component === 'link'"
		:id="id"
		:class="classes"
		:data-variant="variant"
		:for="htmlFor"
		:href="href"
		:inert="disabled"
		:style="style"
		v-bind="filteredAttrs"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<template v-if="$slots">
				<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
					<slot />
				</p>
			</template>
			<span v-else-if="title">{{ $t(title) }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="w-5" />
	</a>
	<button
		v-else
		:id="id"
		:class="classes"
		:data-variant="variant"
		:disabled="disabled"
		:inert="disabled"
		:style="style"
		v-bind="filteredAttrs"
		type="button"
		@click="onClick"
	>
		<MoooomIcon v-if="startIcon" :icon="startIcon" class="w-5" />

		<span class="whitespace-nowrap leading-[100%] empty:hidden">
			<slot v-if="$slots" />
			<span v-else-if="title">{{ $t(title) }}</span>
		</span>

		<MoooomIcon v-if="endIcon" :icon="endIcon" class="w-5" />
	</button>
</template>
