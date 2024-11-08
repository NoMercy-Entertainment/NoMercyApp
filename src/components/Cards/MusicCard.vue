<script setup lang="ts">
import {PropType, computed, ref, watch, nextTick} from 'vue';
import {useTranslation} from 'i18next-vue';

import type {HomeDataItem} from '@/types/api/music';
import type {MusicCardPageResponseData} from '@/types/api/music/musicPlayer';
import type {Album} from "@/types/api/music/album";

import {pickPaletteColor} from '@/lib/colorHelper';
import MusicCardImage from '@/components/Cards/MusicCardImage.vue';


const props = defineProps({
    data: {
        type: Object as PropType<HomeDataItem | MusicCardPageResponseData | Album> | undefined,
        required: true,
    },
    link: {
        type: String as PropType<string | null>,
        required: false,
        default: null,
    },
    className: {
        type: String,
        required: false,
        default: '',
    },
});
watch(props, (value) => {
    if(!value) return;
    nextTick(() =>{
        document.dispatchEvent(new Event('indexer'));
    });
});

const {t} = useTranslation();

const footText = computed(() => {
    let text = '';

    if (props.data.type == 'playlists') {
        text += t('Playlist');
    } else if (props.data.type == 'favorites') {
        text += t('Playlist');
    } else if (props.data.type == 'albums') {
        text += t('Album');
    } else if (props.data.type == 'artists') {
        text += t('Artist');
    } else if (props.data.type == 'release_groups') {
        text += t('Release');
    } else if (props.data.type == 'genres') {
        text += t('Genre');
    }

    if (props.data?.tracks) {
        text += ` • ${props.data?.tracks} ${(props.data?.tracks ?? 0) > 1
            ? t('tracks')
            : t('track')}`;
    } else {
        text += ` • ${props.data?.year}`;
    }

    return text;
});

const ringColor = ref(pickPaletteColor(props.data.color_palette?.cover)
    ?.replace('rgb(', '')
    .replace(')', '')
    .replace(/,/gu, ' ') ?? 'var(--color-primary)');

</script>

<template>
    <RouterLink v-if="data"
          class="relative flex flex-grow flex-col items-center justify-end transition-transform duration-100 group/musicCard active:scale-[98%]"
                :to="`/music/${(data as HomeDataItem)?.type?.replace(/s$/u, '')}/${data?.id}`"
         :style="`--color-focus: ${ringColor}`"
    >
        <MusicCardImage :data="data" />
        <div
            class="flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch py-2 pr-1 pl-2"
        >
            <div class="relative flex flex-grow flex-col items-start justify-center">
                <p
                    class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold line-clamp-1"
                    :title="data?.name ?? (data as HomeDataItem)?.title"
                >
                    {{ data?.name ?? (data as HomeDataItem)?.title }}
                </p>
                <p class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch whitespace-nowrap text-xs font-medium text-auto-10 line-clamp-1 empty:hidden dark:font-normal">
                    {{ footText }}&nbsp;
                </p>
            </div>
        </div>
    </RouterLink>
</template>
