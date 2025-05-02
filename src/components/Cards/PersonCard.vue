<script setup lang="ts">
import { computed, PropType } from "vue";

import type { PersonResponseItem } from "@/types/api/base/person";
import type { InfoCredit } from '@/types/api/base/info';

import { pickPaletteColor } from "@/lib/colorHelper";

import TMDBImage from '@/components/Images/TMDBImage.vue';

const props = defineProps({
    data: {
        type: Object as PropType<PersonResponseItem | InfoCredit> | undefined,
        required: true,
    },
    index: {
        type: Number as PropType<number>,
        required: false,
        default: 0,
    },
});

const scrollLetter = computed(() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`);

const color = computed(() => {
    if (props.data?.deathday) {
        return '255 255 255';
    }

    return props.data?.color_palette?.profile?.primary
        ? pickPaletteColor(props.data?.color_palette?.profile)
        : '';
});

</script>

<template>
    <RouterLink :data-scroll="scrollLetter" v-if="data?.link" :to="data?.link"
        class="frosting group/card border-0 border-focus focus-shift focus-outline transition-all duration-200 flex flex-col h-full items-center relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-50/70 aspect-poster flex-grow-0 [flex:1_1_162px]"
        :style="`
            --color-focus: ${color};
         `">

        <div class="w-full h-full overflow-clip rounded-lg inset-0 absolute">
            <TMDBImage :path="(data as any)?.profile" :title="data?.name" :size="180" aspect="poster"
                :colorPalette="data?.color_palette?.profile"
                className="h-full overflow-clip children:overflow-clip rounded-lg children:rounded-lg" />
            <div
                class="absolute bottom-0 left-0 z-0 grid h-16 w-full items-stretch rounded-b-lg px-1 sm:px-2 py-2 text-left overflow-clip">
                <div class="absolute inset-0 z-0 rounded-b-lg bg-auto-1/80"></div>
                <p
                    class="z-10 text-2xs sm:text-xs font-bold !leading-[0.8rem] h-6 sm:h-7 line-clamp-2 w-available text-slate-lightA-12/70  dark:text-slate-darkA-12/80">
                  {{ data?.name }}
                    <span v-if="data.deathday"
                        class="-mr-1 text-xs leading-3 h-5">&#8224;</span>
                </p>
                <p :title="data?.character ?? data?.job as string"
                    class="z-10 text-2xs sm:text-2xs !leading-none h-6 sm:h-6 line-clamp-2 w-available text-slate-lightA-12/70  dark:text-slate-darkA-12/80 empty:hidden -mr-1">
                    {{ (data?.character ?? data?.job)?.replace('(voice)', '') }}
                </p>
            </div>
        </div>
    </RouterLink>
</template>
