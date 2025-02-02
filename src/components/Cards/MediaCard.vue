<script setup lang="ts">
import { computed, type PropType } from 'vue';

import type { ContinueWatching, HomeItem } from "@/types/api/base/home";
import type { Collection } from "@/types/api/base/collection";
import type { KnownFor } from "@/types/api/base/person";
import type { LibraryResponse } from "@/types/api/base/library";
import type { InfoResponse } from "@/types/api/base/info";

import { pickPaletteColor } from "@/lib/colorHelper";

import { showBackdrops } from '@/store/preferences';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import CardIndicator from '@/components/Cards/CardIndicator.vue';

const props = defineProps({
    data: {
        type: Object as PropType<LibraryResponse | InfoResponse | HomeItem | ContinueWatching | Collection | KnownFor> | undefined,
        required: true,
    },
    index: {
        type: Number as PropType<number>,
        required: false,
        default: 0,
    },
    watch: {
        type: Boolean,
        required: false,
        default: false,
    },
    disableAutoAspect: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const scrollLetter = computed(() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`);

const backdropStyle = computed(() => {
    return showBackdrops.value && !props.disableAutoAspect;
})

const image = computed(() => {
    return props.data?.[backdropStyle.value ? 'backdrop' : 'poster'] as string;
});

</script>

<template>
    <RouterLink v-if="data?.link" :data-scroll="scrollLetter" :to="data?.link"
        class="group/card flex flex-col h-full items-center focus-outline relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-50/70 flex-grow-0"
        :class="backdropStyle ? 'aspect-backdrop' : 'aspect-poster'" :style="`
            --color-focus: ${data?.color_palette?.[backdropStyle ? 'backdrop' : 'poster']
                ? pickPaletteColor(data?.color_palette?.[backdropStyle ? 'backdrop' : 'poster'])
                    .replace(/,/gu, ' ')
                    .replace(')', '')
                    .replace('rgb(', '')
                : ''};
         `">
        <div class="w-full h-full overflow-clip rounded-lg inset-0 absolute">
            <div class="backdropCard-overlay"></div>

            <TMDBImage :path="image" :title="data?.title" loading="lazy" :size="backdropStyle ? 330 : 180"
                :aspect="backdropStyle ? 'backdrop' : 'poster'"
                :colorPalette="data?.color_palette?.[backdropStyle ? 'backdrop' : 'poster']"
                className="h-full overflow-clip rounded-lg" />

            <template v-if="backdropStyle">
                <div v-if="!!(data as HomeItem)?.logo" class="absolute inset-0 h-full w-full">
                    <div
                        class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-auto-1 via-auto-1/60">
                    </div>
                    <div class="absolute bottom-0 left-0 h-full max-h-24 w-full max-w-[66%]">
                        <TMDBImage :path="(data as HomeItem)?.logo" :title="data?.title"
                            :colorPalette="data?.color_palette?.logo" :size="500" loading="lazy"
                            class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
                            className="mr-auto p-4 !duration-700 children:!duration-700" type="logo" />

                    </div>
                </div>
                <div v-else class="absolute inset-0 h-full w-full">
                    <div
                        class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-auto-1 via-auto-1/60">
                    </div>
                    <div class="absolute bottom-4 left-4 w-full max-w-[66%]">
                        <p
                            class="z-10 w-auto text-xl font-bold line-clamp-2 leading-[1.2] text-auto-12 empty:hidden dark:font-medium">
                            {{ data?.title }}
                        </p>
                    </div>
                </div>

            </template>
            <div v-else
                :class="`flex flex-col justify-start items-start w-full contain-strict will-change-transform h-12 z-0 absolute overflow-clip rounded-b-lg left-0 transition-all duration-300 px-2 py-1 group-hover/card:-bottom-0 text-left ${image ? '-bottom-20' : 'bottom-0'}`">
                <div
                    class="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 bg-auto-1/60 overflow-clip rounded-b-lg">
                </div>
                <p
                    class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-2 leading-[1.2] text-auto-12 empty:hidden dark:font-medium text-wrap">
                    {{ data?.title }}
                </p>
            </div>

            <CardIndicator :data="data" />
        </div>
    </RouterLink>
</template>
