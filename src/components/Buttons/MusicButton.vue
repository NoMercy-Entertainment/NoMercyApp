<script setup lang="ts">
import { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import {musicVisibility} from '@/store/audioPlayer';

defineProps({
	onclick: {
		type: Function as PropType<(e: MouseEvent) => void>,
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
            class="grid relative place-content-center w-10 h-10 min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent rounded-full overflow-clip text-contrast bg-transparent active:bg-transparent focus-visible:sm:bg-auto-900/10 items-center sm:hover:bg-auto-900/10 pointer-events-auto focus-visible:ring-white focus-visible:ring-2">
        <slot />
    </button>
</template>
