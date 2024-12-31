<script lang="ts" setup>
import {computed, onMounted, onUnmounted, PropType, ref, watch} from 'vue';
import {useTranslation} from 'i18next-vue';

import type {DisplayList} from '@/types/api/music/musicPlayer';


import {convertToHumanReact, convertToSeconds} from '@/lib/dateTime';
import {setColorPalette} from '@/store/ui';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import {isPlatform} from '@ionic/vue';
import {isArtistRoute} from '@/store/routeState';
import {breakTitle2} from "@/lib/stringArray";
import FavoriteImage from "@/components/Images/FavoriteImage.vue";

const props = defineProps({
    data: {
        type: Object as PropType<DisplayList | undefined>,
        required: false,
    },
});

const {t} = useTranslation();

const duration = ref<string | undefined>('');

const calculateDuration = (value?: typeof props.data) => {
    if (!value) return;
    return convertToHumanReact(t,
        value?.tracks
            ?.map(t => convertToSeconds(t.duration))
            .reduce((prev, curr) => prev + curr, 0) ?? 0);
};

watch(props, (value) => {
    if (!value) return;
    duration.value = calculateDuration(value.data);
    if (value.data?.color_palette) {
        setColorPalette(value.data?.color_palette?.cover);
    }
});

onMounted(() => {
    duration.value = calculateDuration(props.data);
    setColorPalette(props.data?.color_palette?.cover);
});

onUnmounted(() => {
    setColorPalette(null);
})

function processImage(data: Event & { target: HTMLImageElement; }) {
//     if (props.data?.color_palette?.cover) return;
//     const colors = getDominantColor(data.target);
//     setColorPalette(colors);
}

</script>

<template>
    <div class="relative z-0 flex flex-col items-end justify-start gap-4 px-8 text-white sm:flex-row sm:gap-9 sm:pt-12 sm:pb-8 sm:px-8"
      :class="{
        'pt-safe-offset-12': isPlatform('capacitor'),
        'pt-8': !isPlatform('capacitor')
      }"
    >
        <div class="absolute top-0 left-0 h-full w-full overflow-clip bg-focus"></div>
        <div class="absolute top-0 left-0 h-full w-full overflow-clip bg-black/50  "></div>
        <div
            class="frosting relative mx-auto flex aspect-square -mt-4 h-amin-w-80 flex-col items-center justify-center overflow-clip rounded-xl bg-gradient-to-br min-w-64 bg-theme-7 from-theme-5 via-theme-7 to-theme-11 shadow">
            <CoverImage
                id="image"
                v-if="data?.cover"
                :data="data"
                :onload="processImage"
                :size="250"
                className="aspect-square h-amin-w-80 rounded-xl min-w-80"
                loading="eager"/>
          <FavoriteImage
              v-else-if="data?.id"
              :id="data.id"
              :type="data.type"
              class="aspect-square h-amin-w-80 rounded-xl min-w-80"
          />
        </div>

        <div v-if="data?.name"
            class="relative mb-4 flex w-full flex-1 flex-shrink-0 flex-col items-start justify-start gap-4 flex-grow-1 sm:hidden">
            <div v-if="data.name.length > 50" class="w-full text-3xl font-semibold line-clamp-1 leading-[130%] whitespace-pre"
               v-html="breakTitle2(data?.name ?? 'Songs you like', 'text-2xl line-clamp-1')">
            </div>
            <p v-else class="w-full text-3xl font-semibold line-clamp-1 leading-[130%] whitespace-pre">
                {{ data?.name ?? 'Songs you like' }}
            </p>
            <p class="text-left font-semibold uppercase text-white">
                {{ data?.type?.replace(/s$/u, '') }}
            </p>

        </div>

        <div class="relative hidden flex-1 flex-shrink-0 flex-col items-start justify-start gap-1 flex-grow-1 sm:flex">
            <p class="text-left font-semibold uppercase text-white">
                {{ data?.type?.replace(/s$/u, '') }}
            </p>
            <div
                class="w-full text-5xl font-semibold line-clamp-2 leading-[130%] whitespace-pre"
               v-html="breakTitle2(data?.name ?? 'Songs you like', 'ml-2 text-2xl line-clamp-1')">
            </div>

            <div class="relative flex items-center justify-start gap-2">
                <div v-if="isArtistRoute"
                    class="flex items-center gap-4 text-sm font-medium">
                    <div v-if="data?.artists?.length == 1 && data?.artists?.[0].cover"
                         class="relative aspect-square h-12 w-12 overflow-clip rounded-full min-w-12">
                        <CoverImage
                            id="image"
                            :data="data?.artists?.[0]"
                            :onload="processImage"
                            :size="250"
                            className="h-full w-full"
                            loading="eager"/>
                    </div>
                    <RouterLink :to="data?.artists?.[0].link ?? '#'"
                          class="text-sm empty:hidden">
                        {{ data?.artists?.[0]?.name ?? 'Various artists' }}
                    </RouterLink>
                </div>
                <p v-if="data?.tracks && isArtistRoute"
                   class="text-left text-sm font-medium text-white">•</p>
                <p class="text-left text-sm font-medium text-white">
                    {{ data?.tracks?.length }}
                    {{ data?.tracks?.length == 1 ? t('song') : t('songs') }}
                </p>
                <p v-if="duration" class="text-left text-sm font-medium text-white">•</p>
                <p class="text-left text-sm font-medium text-white">
                    {{ duration }}
                </p>
            </div>
        </div>
    </div>
</template>
