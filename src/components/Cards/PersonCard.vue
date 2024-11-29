<script setup lang="ts">
import {computed, PropType} from "vue";

import type {PersonResponseItem} from "@/types/api/base/person";
import type {InfoCredit} from '@/types/api/base/info';

import {pickPaletteColor} from "@/lib/colorHelper";

import TMDBImage from '@/components/Images/TMDBImage.vue';

const props = defineProps({
    data: {
        type: Object as PropType<PersonResponseItem|InfoCredit> | undefined,
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
    <RouterLink
        :data-scroll="scrollLetter"
        v-if="data?.link"
        :to="data?.link"
        class="group/card border-0 border-focus focus-shift focus-outline transition-all duration-300 flex flex-col h-full items-center overflow-clip relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-50/70 aspect-poster flex-grow-0 [flex:1_1_162px]"
        :style="`
            --color-focus: ${color};
         `">

        <TMDBImage
            :path="(data as any)?.profile"
            :title="data?.name"
            :size="180"
            aspect="poster"
            :colorPalette="data?.color_palette?.profile"
            className="h-full overflow-clip children:overflow-clip rounded-lg children:rounded-lg"/>
        <div
            class="absolute bottom-0 left-0 z-0 grid h-16 w-full items-stretch rounded-b-lg px-2 pt-2 pb-1 text-left overflow-clip">
            <div class="absolute inset-0 z-0 rounded-b-lg bg-auto-1/60 backdrop-blur-lg"></div>
            <p class="z-10 text-2xs sm:text-sm font-bold leading-none sm:leading-4 h-7 sm:h-5 line-clamp-2 w-available text-slate-lightA-12/70  dark:text-slate-darkA-12/80">
                {{ data?.name }}
							<span v-if="data.deathday"
										class="-mr-1 text-xs sm:text-base leading-none sm:leading-4 h-7 sm:h-6">&#8224;</span>
            </p>
            <p :title="data?.character ?? data?.job as string"
               class="z-10 text-2xs sm:text-xs font-bold leading-none sm:leading-4 h-6 sm:h-9 line-clamp-2 w-available text-slate-lightA-12/60 dark:text-slate-darkA-12/70 empty:hidden dark:font-medium">
                {{ data?.character ?? data?.job }}
            </p>
        </div>
    </RouterLink>
</template>
