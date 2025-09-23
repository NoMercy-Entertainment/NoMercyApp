<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

const props = defineProps({
	id: {
		type: String,
		required: false,
	},
	modelValue: {
		type: Boolean as PropType<false | null | true>,
		required: false,
		default: null,
	},
	label: {
		type: String,
		required: false,
	},
	width: {
		type: String,
		required: false,
		default: '18',
	},
	height: {
		type: String,
		required: false,
		default: '18',
	},
	color: {
		type: String,
		required: false,
		default: 'hsl(from var(--color-theme-8) h s 20%)',
	},
	onclick: {
		type: Function as PropType<() => void>,
		required: false,
	},
});

const emit = defineEmits(['update:modelValue']);

function cycle() {
	if (props.onclick) {
		props.onclick?.();
		return;
	}
	let newValue;
	if (props.modelValue === null) {
		newValue = true;
	}
	else if (props.modelValue === true) {
		newValue = false;
	}
	else {
		newValue = null;
	}
	emit('update:modelValue', newValue);
}

function handleClick() {
	if (props.onclick) {
		props.onclick?.();
		return;
	}
	let newValue;
	if (props.modelValue === null || props.modelValue === false) {
		newValue = true;
	}
	else if (props.modelValue === true) {
		newValue = false;
	}
	emit('update:modelValue', newValue);
}

const defs = computed(() => {
	return `
      <defs>
        <linearGradient id="paint0_linear_4922_9259" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse" >
          <stop stop-color="white" stop-opacity="0.4" offset="0"></stop>
          <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
	`;
});

const svgPaths = computed(() => {
	if (props.modelValue === null) {
		return `
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" fill="${props.color}" fill-opacity="0.29" ></rect>
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" stroke="#6F52FF" stroke-opacity="0.73" stroke-width="0.5" ></rect>
      <rect x="0.25" y="0.25" width="17.5" height="17.5" rx="3.75" stroke="url(#paint0_linear_4922_9259)" stroke-width="0.5" ></rect>
      <path d="M4.91675 9H13.0834" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
      ${defs.value}
    `;
	}
	else if (props.modelValue) {
		return `
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" fill="${props.color}"></rect>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#E2F0FD" stroke-opacity="0.08" ></rect>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="url(#paint0_linear_4922_9259)" ></rect>
      <path d="M13.6666 5.5L7.24992 11.9167L4.33325 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
      ${defs.value}
    `;
	}
	else {
		return `
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" class="fill-surface-1" fill-opacity="1"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" fill="#DFEFFE" fill-opacity="0.14"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#E5F2FE" stroke-opacity="0.26"/>
      <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="url(#paint0_linear_4922_9259)"/>
      ${defs.value}
    `;
	}
});
</script>

<template>
	<div
		class="relative flex select-none items-center justify-start gap-2 self-stretch border border-transparent bg-transparent"
		@click="handleClick"
	>
		<input
			:id="id"
			:checked="!!modelValue"
			class="hidden item-selector"
			type="checkbox"
		>
		<svg
			:id="id"
			:height="height"
			:width="width"
			class="relative w-[18px] h-[18px]"
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g v-html="svgPaths" />
		</svg>
		<div
			v-if="label"
			class="relative flex flex-grow items-center justify-center gap-2 px-2"
		>
			<p class="w-full flex-grow text-sm font-medium">
				{{ $t(label) }}
			</p>
		</div>
		<slot />
	</div>
</template>
