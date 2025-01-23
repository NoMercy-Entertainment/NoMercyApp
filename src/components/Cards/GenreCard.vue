<script setup lang="ts">
import { computed, PropType } from "vue";

import type { GenreResponse } from "@/types/api/base/genre";

import { genreColors } from "@/config/global";
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
    data: {
        type: Object as PropType<GenreResponse> | undefined,
        required: true,
    },
    index: {
        type: Number as PropType<number>,
        required: false,
        default: 0,
    },
});

const scrollLetter = computed(() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`);

const rotate = computed(() => {
    return {
        0: 'group-hover/card:rotate-[-4deg] group-hover/card:scale-[1.1]',
        1: 'group-hover/card:rotate-[4deg] group-hover/card:scale-[1.1]',
    }[props.index % 2];
});

const genreColor = computed(() => genreColors(props.data.title));

</script>

<template>
    <RouterLink :data-scroll="scrollLetter" :to="data.have_items > 1 ? `/genres/${data.id}` : '#'"
        :class="`flex flex-col relative justify-start items-center w-full h-auto aspect-poster flex-grow flex-shrink-0 overflow-hidden rounded-lg border-1-light transition-all duration-300 select-none group/card ${genreColor.bg}`">

        <div class="backdropCard-overlay"></div>
        <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-center h-[70%]">
            <div :class="`flex items-center justify-center w-auto h-auto aspect-square p-4 object-cover rounded-3xl overflow-clip transition-all duration-300 ${rotate} ${genreColor.iconBg} rounded-3xl
            shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)]
            hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)]
            dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
            dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]`"
                style="
                    background: radial-gradient(50% 50% at 50% 100%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.06) 40%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.12) 100%), rgba(var(--background-auto-5) / 20%);
                    background-blend-mode: normal, overlay, normal;
                ">
                <MoooomIcon className="w-20" :icon="genreColor['icon']" />
            </div>
        </div>
        <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center self-stretch px-4 pb-0">
            <p class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold w-available line-clamp-1">
                {{ $t(data.title) }}
            </p>
            <p class="flex-shrink-0 flex-grow-0 self-stretch text-xs opacity-60 w-available">
                {{ data.have_items }} {{ data.have_items > 1 ? 'items' : 'item' }}
            </p>
        </div>
    </RouterLink>
</template>
