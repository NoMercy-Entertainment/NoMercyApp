<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useTranslation} from 'i18next-vue';
import {isPlatform} from '@ionic/vue';

import {pickPaletteColor} from '@/lib/colorHelper';

import ProgressBarContainer from '../components/ProgressBarContainer.vue';
import TopRow from '../mobile/TopRow.vue';
import TrackRow from '../mobile/TrackRow.vue';
import ButtonContainer from '../mobile/ButtonContainer.vue';
import {useAutoThemeColors} from '@/store/preferences';
import {currentSong, musicSize, musicVisibility} from '@/store/audioPlayer';
import sidebar from '@/store/sidebar';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import {SizeState} from '@/types/musicPlayer';
import MusicButton from '@/components/Buttons/MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import LyricsOverlay from '@/Layout/Desktop/components/Overlays/LyricsOverlay.vue';


const {t} = useTranslation();

const lyricsSize = ref<'small' | 'full'>('small');

const handleExpand = () => {
  lyricsSize.value = lyricsSize.value == 'small'
      ? 'full'
      : 'small';

  const lyricsContainer = document.querySelector<HTMLDivElement>('#lyricsContainer')!;
  if (lyricsSize.value == 'small') {
    lyricsContainer.style.height = '25rem';
  } else {
    lyricsContainer.style.height = `${window.innerHeight - 105}px`;
  }
};

watch(lyricsSize, () => {
  setTimeout(() => {
    if (lyricsSize.value == 'small') {
      document.querySelector<HTMLDivElement>('#MobilePlayer')?.scrollTo({
        top: window.innerHeight / 2,
        behavior: 'smooth',
      });
    } else {
      document.querySelector<HTMLDivElement>('#MobilePlayer')?.scrollTo({
        top: 999990,
        behavior: 'smooth',
      });
    }
  }, 200);
}, {immediate: true});

const focusColor = computed(() => {
  if (!useAutoThemeColors.value) return 'var(--color-theme-7)';

  return pickPaletteColor(currentSong.value?.color_palette?.cover, 40, 160)
      .replace(/,/gu, ' ')
      .replace('rgb(', '');
});

</script>

<template>
  <Teleport to="body">
    <div id="MobilePlayer"
         v-if="currentSong?.id"
         class="fixed sm:!hidden top-0 flex h-screen w-screen compact:translate-y-full flex-col overflow-auto transition-transform duration-300 compact:duration-500 z-[1299] bg-auto-1"
         :style="`--color-focus: ${focusColor}`"
         :data-size="musicSize"
         :data-music="musicVisibility"
         :data-sidebar="sidebar">

      <div class="pointer-events-none fixed top-0 z-50 h-6 w-full bg-focus"
           v-if="isPlatform('android') && isPlatform('cordova')"></div>

      <div
          class="relative z-0 flex h-screen min-h-screen flex-col items-center justify-between gap-2 px-6 pt-2 w-inherit"
          :data-size="musicSize">
        <div class="pointer-events-none absolute inset-0 w-full min-h-[120vh] bg-spotifyBottom bg-focus"></div>

        <TopRow/>

        <div class="-mt-6 w-full max-w-2xl"
             :data-size="musicSize">
          <CoverImage :data="currentSong"
                      v-if="currentSong"
                      :size="320"
                      className="pointer-events-none relative aspect-square h-auto overflow-clip rounded-md w-inherit"/>
        </div>

        <TrackRow/>

        <ProgressBarContainer v-if="musicSize == SizeState.full"
                              class="children:!mx-0 gap-4"
        />
        <ButtonContainer/>
      </div>

      <div class="relative mx-3 -mt-10 mb-5 rounded-2xl pt-10 pb-4 w-available max-h-nav bg-focus">
        <div class="absolute top-0 z-10 flex w-full items-center rounded-t-2xl pr-2 pl-4 font-semibold">
          <span>{{ t('Lyrics') }}</span>
          <MusicButton label="expand"
                       class="ml-auto"
                       :onclick="handleExpand">
            <MoooomIcon v-if="lyricsSize == 'full'" icon="arrowExitFullscreen" class="h-5 w-5" />
            <MoooomIcon v-else icon="arrowEnterFullscreen" class="h-5 w-5" />
          </MusicButton>
        </div>
        <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black opacity-40">
        </div>

        <div
            class="relative -mb-2 w-full flex-col overflow-auto scroll-smooth rounded-b-2xl p-4 transition-transform duration-150 h-[25rem]"
            id="lyricsContainer">

          <LyricsOverlay class="sm:hidden"/>
        </div>
      </div>
    </div>
  </Teleport>
</template>
