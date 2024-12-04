<script setup lang="ts">
import { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import {musicVisibility} from '@/store/audioPlayer';

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
    <button :aria-label="t(label)"
            :title="t(label)"
            :onclick="onclick"
            :data-state="musicVisibility"
            :tabindex="musicVisibility == 'showing' ? 0 : -1"
            class="grid relative place-content-center w-10 h-10 min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip text-contrast pointer-events-auto focus-visible:ring-white focus-visible:ring-2 group/button gap-2 p-2.5 items-center rounded-lg bg-slate-lightA-2 dark:bg-slate-darkA-2/[1%] active:!bg-slate-lightA-4 focus-visible:sm:!bg-slate-lightA-4 sm:hover:!bg-slate-lightA-4 dark:active:!bg-slate-darkA-4 dark:focus-visible:sm:!bg-slate-darkA-4 dark:sm:hover:!bg-slate-darkA-4">
        <slot />
    </button>
</template>
