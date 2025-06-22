<script lang="ts" setup>
import { useTranslation } from 'i18next-vue';
import router from '@/router';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

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

const { t } = useTranslation();

const back = () => window.history.back();
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
		class="z-999 w-fit flex flex-nowrap gap-1 px-3 h-10 py-1 justify-center items-center top-4 left-4 bg-slate-light-3 dark:bg-slate-dark-1 rounded-lg focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-auto-100 focus-visible:ring-contrast focus-visible:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95 focus-visible:ring-[rgb(var(--color-focus))] text-auto-12"
		@click="() => route && router.push(route)"
	>
		<OptimizedIcon icon="arrowLeft" class="h-6 w-6" />
		<span class="mx-1">
			{{ t("Back") }}
		</span>
	</button>

	<button
		v-else
		:class="
			position === 'absolute'
				? 'absolute'
				: `${position} -translate-x-5 -translate-y-3`
		"
		class="z-999 w-fit flex flex-nowrap gap-1 px-3 py-1 items-center top-4 left-4 bg-slate-light-3 dark:bg-slate-dark-1 rounded-lg focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-auto-100 focus-visible:ring-contrast focus-visible:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95 focus-visible:ring-[rgb(var(--color-focus))] text-auto-12"
		@click="back"
	>
		<OptimizedIcon icon="arrowLeft" class="h-6 w-6" />
		<span class="mx-1">
			{{ t("Back") }}
		</span>
	</button>
</template>
