<script lang="ts" setup>
import {onMounted, onUnmounted, type PropType, ref, toRaw} from 'vue';

import type {InfoResponse} from '@/types/api/base/info';

import type {NMPlayer, PlaylistItem, SetupConfig} from '@/lib/VideoPlayer';
import {DesktopUIPlugin, KeyHandlerPlugin, nmplayer,} from '@/lib/VideoPlayer';
import {closeSidebar, setSidebar, sidebar} from '@/store/sidebar';
import {setDisableScreensaver} from '@/store/imageModal';
import {musicVisibility} from '@/store/audioPlayer';

const props = defineProps({
  videos: {
    type: Array as PropType<InfoResponse['videos']>,
    required: true,
  },
  toggle: {
    type: Function as PropType<() => void>,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  incrementTrailerIndex: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const trailerContainer = ref<HTMLElement>();
const sidebarState = ref();

interface MyNmPlayer extends NMPlayer {
  showInProduction: () => boolean;
  getPlaylistItem: () => PlaylistItem & {
    tmdb_id: number,
    special_id: number,
    video_type: string,
    video_id: number;
  };
}

const trailer = ref<MyNmPlayer>();

onMounted(() => {
  sidebarState.value = sidebar.value;

  closeSidebar();

  setDisableScreensaver(true);

  if (!props.videos[props.index].src) return;

  const config: SetupConfig = {
    muted: false,
    controls: false,
    autoPlay: true,
    chapters: false,
    preload: 'auto',
    playlist: [
      {
        id: props.videos[props.index].src,
        image: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${props.videos[props.index].src}.jpg`,
        file: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${props.videos[props.index].src}.webm`,
        title: `${props.videos[props.index].name.toLocaleLowerCase().includes(props.title.toLocaleLowerCase())
            ? ''
            : `${props.title} - `}${props.videos[props.index].name}`.toTitleCase(),
        duration: '',
        description: '',
        tracks: [
          {
            label: 'full',
            file: `https://trailer.nomercy.tv/${props.videos[props.index].src}/${props.videos[props.index].src}.en.vtt`,
            language: 'eng',
            kind: 'subtitles',
          },
        ],
      },
    ],
    playbackRates: [],
  };

  // @ts-ignore
  trailer.value = nmplayer('trailer')
      .setup(config);

  trailer.value?.once('back', () => {
    props.toggle();
  });

  const desktopUIPlugin = new DesktopUIPlugin();
  trailer.value?.registerPlugin('desktopUI', desktopUIPlugin);
  trailer.value?.usePlugin('desktopUI');

  const keyHandlerPlugin = new KeyHandlerPlugin();
  trailer.value?.registerPlugin('keyHandler', keyHandlerPlugin);
  trailer.value?.usePlugin('keyHandler');

  // @ts-ignore
  window.trailer = toRaw(trailer.value);

  trailer.value?.on('ended', () => {

    setSidebar(sidebarState.value);
    props.toggle();
  });
  trailer.value?.on('remove', () => {
    props.toggle();
    props.incrementTrailerIndex();
  });
  trailer.value?.on('error', () => {
    props.toggle();
  });
  trailer.value?.on('close', () => {
    props.toggle();
  });

  trailer.value?.on('captionsChanged', (item: any) => {
    if (item.track == -1) {
      localStorage.setItem('trailerSubtitles', 'off');
    } else {
      localStorage.setItem('trailerSubtitles', item.track);
    }
  });

  trailer.value?.on('play', () => {
    if (localStorage.getItem('trailerSubtitles') == 'off') {
      trailer.value?.setCurrentCaption(-1);
    } else {
      trailer.value?.setCurrentCaption(parseInt(localStorage.getItem('trailerSubtitles') ?? '-1', 10));
    }
  });
});

onUnmounted(() => {
  setSidebar(sidebarState.value);
  setDisableScreensaver(false);

  if (trailer.value) {
    try {
      trailer.value?.dispose();
    } catch (e) {
      //
    }
  }
});

</script>

<style scoped>
</style>

<template>
  <div @click="toggle" class="fixed h-full w-full overflow-hidden rounded-lg bg-black/5 0">
    <div :data-music="musicVisibility"
         :data-sidebar="sidebar"
         class="absolute w-auto overflow-hidden inset-1/2 aspect-video transition-transform duration-300 -translate-y-[50%]  music-showing:-translate-y-[52%]
              sidebar-closed:h-[93%]
              sidebar-closed:px-4
              sidebar-closed:py-2
              sidebar-closed:xl:px-[1.8rem]
              sidebar-closed:xl:py-4

              -translate-x-[50%]
              sidebar-open:h-5/6
              sidebar-open:px-10
              sidebar-open:py-6
              sidebar-open:xl:px-[2.8rem]
              sidebar-open:xl:py-6
      "
    >
      <div ref="trailerContainer"
           @click="(e: MouseEvent) => e.stopPropagation()"
           class="relative rounded-2xl flex overflow-clip children:overflow-clip w-full h-full children:!w-full children:!h-auto children:!aspect-video">
        <div id="trailer" class="group nomercyplayer"></div>
      </div>
    </div>
  </div>
</template>
