<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

import { humanTime } from '@/lib/dateTime';
import ProgressBar from './ProgressBar.vue';
import { stopPropagation } from '@/lib/utils/dom';
import {
	currentTime,
	duration,
	musicSize,
	remainingTime,
} from '@/store/audioPlayer';

defineProps({
	size: {
		type: String,
		default: 'full',
	},
	color: {
		type: String,
		required: false,
	},
	variant: {
		type: String as PropType<'stacked' | 'default'> | undefined,
		default: 'default',
	},
	onKeyDown: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: false,
	},
	onKeyUp: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: false,
	},
});

const timeChoice = ref<'duration' | 'remaining'>(
	(localStorage.getItem('timeChoice') as 'duration' | 'remaining')
	|| 'remaining',
);

function toggleTimeChoice() {
	if (timeChoice.value === 'duration') {
		timeChoice.value = 'remaining';
	}
	else {
		timeChoice.value = 'duration';
	}
	localStorage.setItem('timeChoice', timeChoice.value);
}
</script>

<template>
	<div
		class="flex items-center justify-center !w-full flex-row select-none monospace"
		:data-size="musicSize"
		@click="stopPropagation"
	>
		<div v-if="variant === 'stacked'" class="flex w-full flex-col">
			<div class="flex w-full items-center justify-between">
				<div
					class="music-compact:pointer-events-none pointer-events-auto flex h-full items-center w-available"
					:data-size="musicSize"
				>
					<ProgressBar
						:color="color"
						:on-key-down="onKeyDown"
						:on-key-up="onKeyUp"
					/>
				</div>
			</div>

			<div class="flex w-full items-center justify-between">
				<span
					aria-label="current time"
					class="mx-2 !text-contrast whitespace-nowrap text-xs relative block"
					:data-size="musicSize"
				>
					{{ humanTime(currentTime) }}
				</span>

				<span
					class="mx-2 !text-contrast whitespace-nowrap text-xs relative flex justify-between monospace"
					:data-size="musicSize"
					@click="toggleTimeChoice"
				>
					<span
						v-if="timeChoice === 'duration'"
						aria-label="duration"
						class=""
						:data-size="musicSize"
					>
						{{ humanTime(duration) }}
					</span>
					<span v-else aria-label="remaining time">
						{{ humanTime(remainingTime) }}
					</span>
				</span>
			</div>
		</div>
		<div v-else class="flex w-full items-center">
			<span
				aria-label="current time"
				class="mx-2 !text-contrast whitespace-nowrap text-xs relative block"
				:data-size="musicSize"
			>
				{{ humanTime(currentTime) }}
			</span>
			<div
				class="w-available h-full items-center flex full:mb-2 !mb-0 music-compact:pointer-events-none pointer-events-auto"
				:data-size="musicSize"
			>
				<ProgressBar :color="color" />
			</div>
			<span
				class="mx-2 !text-contrast whitespace-nowrap text-xs relative flex justify-between"
				:data-size="musicSize"
				@click="toggleTimeChoice"
			>
				<span
					v-if="timeChoice === 'duration'"
					aria-label="duration"
					class=""
					:data-size="musicSize"
				>
					{{ humanTime(duration) }}
				</span>
				<span v-else aria-label="remaining time">
					{{ humanTime(remainingTime) }}
				</span>
			</span>
		</div>
	</div>
</template>
