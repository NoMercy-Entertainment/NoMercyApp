<script setup lang="ts">
import {computed} from "vue";

import {getColorFromPercent, greenToRed} from "@/lib/colorHelper";
import {usePercentageColors} from '@/store/preferences';

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	}
});

const color = computed(() => {
	if (usePercentageColors.value)
		return getColorFromPercent(props.value, greenToRed);

	return 'rgb(var(--color-focus))';
});

const halfCircumference = computed(() => Math.PI * 72);
const strokeDashoffset = computed(() => (1 - (props.value == -1 ? 0 : props.value) / 100) * halfCircumference.value);

</script>

<template>
	<div
		class="relative flex aspect-video h-auto w-full flex-1 flex-shrink-0 flex-col items-start justify-center gap-1 flex-grow-1"
	>
		<div class="relative h-full flex-1 flex-shrink-0 w-available">
			<svg
				viewBox="0 0 152 148"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="absolute inset-2 mx-auto rounded"
				:style="{
						width: size * 2,
						height: size * 2
				}"
				preserveAspectRatio="xMidYMid meet"
			>
				<path
					d="M148 76C148 66.5448 146.138 57.1822 142.519 48.4468C138.901 39.7114 133.598 31.7741 126.912 25.0883C120.226 18.4025 112.289 13.099 103.553 9.48068C94.8178 5.86234 85.4552 4 76 4C66.5448 3.99999 57.1823 5.86232 48.4468 9.48066C39.7114 13.099 31.7742 18.4025 25.0883 25.0883C18.4025 31.7741 13.099 39.7113 9.48069 48.4468C5.86234 57.1822 4 66.5448 4 76"
          class="stroke-auto-2 dark:stroke-auto-1"
					stroke-width="8"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
				<path
					class="absolute -top-1 -left-1 h-2 rounded transition-all duration-500"
					d="M4 76C4 56.9044 11.5857 38.5909 25.0883 25.0883C38.5909 11.5857 56.9044 4 76 4C95.0956 4 113.409 11.5857 126.912 25.0883C140.414 38.5909 148 56.9044 148 76"
					:style="{
							stroke: color,
							strokeDasharray: halfCircumference,
							strokeDashoffset: strokeDashoffset,
					}"
					stroke-width="8"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg>
			<p
				class="absolute top-2/3 left-1/2 -translate-x-1/2 text-center font-semibold text-[2.5vw] monospace sm:text-[1.5vw] md:text-[2vw] lg:text-[1.2vw] 2xl:text-[1vw] 5xl:text-[0.6vw]"
			>
				{{ value == -1 ? $t('') : Math.floor(value) }}{{ value == -1 ? '' : '%' }}
			</p>
		</div>
		<p
			class="flex-shrink-0 flex-grow-0 scale-75 self-stretch text-center text-sm font-semibold w-available text-[2.5vw] sm:text-[1.5vw] md:text-[2vw] lg:text-[1.2vw] 2xl:text-[1vw] 5xl:text-[0.7vw]"
		>
			{{ name }}
		</p>
	</div>
</template>
