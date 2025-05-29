<script setup lang="ts">
import { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { musicVisibility } from '@/store/audioPlayer';

defineProps({
	onclick: {
		type: Function as PropType<(e?: MouseEvent) => void>,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
});

const { t } = useTranslation();

</script>

<template>
	<button :aria-label="t(label)" :title="t(label)" :onclick="onclick" :data-state="musicVisibility"
		class="grid relative place-content-center w-10 h-10 focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-2/[1%] active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6">
		<slot />
	</button>
</template>
