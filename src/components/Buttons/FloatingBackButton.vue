<script lang="ts" setup>
import router from '@/router';

defineProps({
	position: {
		type: String,
		required: false,
		default: 'absolute',
	},
	route: {
		type: String,
		required: false,
	},
});

const back = () => router.back();
</script>

<template>
	<button
		v-if="route"
		:class="
			position === 'absolute'
				? 'absolute'
				: position === 'static'
					? 'static'
					: `${position} -translate-x-3 -translate-y-8`
		"
		class="z-999 w-fit flex flex-nowrap gap-1 px-3 h-10 py-1 justify-center items-center top-4 left-4 bg-surface-2/11 rounded-lg focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-offset-transparent focus-visible:ring-contrast focus-visible:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95 focus-visible:ring-surface-7/11"
		@click="() => route && router.push(route)"
	>
		<MoooomIcon class="h-6 w-6" icon="arrowLeft" />
		<span class="mx-1">
			{{ $t("Back") }}
		</span>
	</button>

	<button
		v-else
		:class="
			position === 'absolute'
				? 'absolute'
				: `${position} -translate-x-5 -translate-y-3`
		"
		class="z-999 w-fit flex flex-nowrap gap-1 px-3 py-1 items-center top-4 left-4 bg-surface-2/11 rounded-lg focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-offset-transparent focus-visible:ring-contrast focus-visible:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95 focus-visible:ring-surface-7/11"
		@click="back"
	>
		<MoooomIcon class="h-6 w-6" icon="arrowLeft" />
		<span class="mx-1">
			{{ $t("Back") }}
		</span>
	</button>
</template>
