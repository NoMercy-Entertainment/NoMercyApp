<script setup lang="ts">
import {type PropType, ref, computed} from 'vue';

import type {HomeDataItem} from '@/types/api/music';
import type {PaletteColors} from "@/types/api/shared";
import type {DisplayList, MusicCardPageResponseData} from "@/types/api/music/musicPlayer";
import type {Album, AlbumResponse} from "@/types/api/music/album";
import type {Artist} from "@/types/api/music/artist";
import type {Song} from '@/types/musicPlayer';

import {hexLighter} from "@/lib/colorHelper";
import {currentServer} from '@/store/currentServer';
import {useAutoThemeColors} from '@/store/preferences';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';

const props = defineProps({
    data: {
        type: Object as PropType<HomeDataItem | Song | Artist | Album | DisplayList | MusicCardPageResponseData | AlbumResponse | undefined | null>,
        required: false,
    },
    className: {
        type: String,
        required: false,
        default: '',
    },
    disableGradient: {
        type: Boolean as PropType<boolean>,
        required: false,
        default: false,
    },
    style: {
        type: Object as PropType<Record<string, string>>,
        required: false,
        default: () => ({}),
    },
    id: {
        type: String,
        required: false,
        default: '',
    },
    loading: {
        type: String as PropType<'lazy' | 'eager' | undefined>,
        required: false,
        default: 'lazy',
    },
    onload: {
        type: Function as PropType<(data: Event & { target: HTMLImageElement }) => void>,
        required: false,
    },
    handleFocus: {
        type: Function as PropType<(e: FocusEvent, track: Song) => void>,
        required: false,
    },
    size: {
        type: Number as PropType<number | undefined>,
        required: false,
        default: 500,
    },
    colorPalette: {
        type: Object as PropType<PaletteColors | undefined>,
        required: false,
    },
});

const error = ref(false);
const opacity = ref(0);

const baseImageUrl = computed(() => {
    return `${currentServer.value?.serverBaseUrl}/images/music${props.data?.cover}`;
});

const remove = (e: ErrorEvent) => {
    (e.target as HTMLImageElement)?.parentNode?.children[0].remove();
    error.value = true;
};

const onLoad = () => {
    opacity.value = 1;
};

const onLoadStart = () => {
    opacity.value = 0;
};

const style = computed(() => {
    return {
        '--c-1': 'rgb(var(--color-focus))',
        '--c-2': 'rgb(var(--color-focus) / 3%)',
        '--c-3': 'rgb(var(--color-focus) / 14%)',
        '--c-4': 'rgb(var(--color-focus) / 1%)',

        backgroundImage: props.disableGradient || !useAutoThemeColors
            ? props.disableGradient
                ? ''
                : `
                    radial-gradient(
                        farthest-corner at top left,
                                rgb(var(--color-theme-9)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                rgb(var(--color-theme-2)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                rgb(var(--color-theme-6)),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                rgb(var(--color-theme-12)),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `
            : `
				radial-gradient(
					farthest-corner at top left,
							${hexLighter(props.colorPalette?.lightVibrant, 30) ?? 'var(--c-1)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${hexLighter(props.colorPalette?.lightMuted, 30) ?? 'var(--c-2)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${hexLighter(props.colorPalette?.primary, 30) ?? 'var(--c-3)'},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${hexLighter(props.colorPalette?.darkMuted, 30) ?? 'var(--c-4)'},
					hsl(0 0% 100% / 4%) 300px
				)
			`,
    };
});

</script>

<template>
    <div
        :class="`${className} aspect-square`"
        :style="style">

        <picture v-if="data?.cover"
                 class="aspect-square inset-0 !absolute top-0 overflow-clip z-10 h-available w-available object-cover transition-all duration-300"
                 :style="`opacity: ${opacity};`">
            <source
                :srcset="`${baseImageUrl}?width=300&type=avif 1x`"
                type="image/avif"
            />
            <source
                :srcset="`${baseImageUrl}?width=${(size ?? 500)}&type=webp 1x`"
                type="image/webp"
            />
            <source
                :srcset="`${baseImageUrl}?width=${(size ?? 500)}&type=jpg 1x`"
                type="image/jpeg"
            />
            <img :src="baseImageUrl"
                 :alt="`cover image for ${data?.name ?? 'image'}`"
                 :id="id"
                 class="aspect-square !absolute top-0 z-10 h-available w-available object-cover"
                 :loading="loading"
                 crossorigin="anonymous"
                 :data-id="data?.id"
                 :onfocus="handleFocus"
                 :onload="onLoad"
                 :onloadstart="onLoadStart"
                 :onerror="remove"
            />
        </picture>
        <div v-else
             class="inset-0 grid aspect-video h-full w-full place-items-center bg-black p-2 place-center">
            <div
                class="w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]">
                <AppLogoSquare class="h-auto w-3/5" />
            </div>
        </div>
    </div>
</template>
