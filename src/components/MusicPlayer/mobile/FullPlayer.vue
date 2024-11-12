<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useTranslation} from 'i18next-vue';
import {IonContent, IonModal} from '@ionic/vue';

import {currentSong, fullPlayerModalOpen} from '@/store/audioPlayer';

import LyricsOverlay from '@/Layout/Desktop/components/Overlays/LyricsOverlay.vue';

import ProgressBarContainer from '@/components/MusicPlayer/components/ProgressBarContainer.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

import TopRow from '../mobile/TopRow.vue';
import TrackRow from '../mobile/TrackRow.vue';
import ButtonContainer from '../mobile/ButtonContainer.vue';
import {useAutoThemeColors} from '@/store/preferences';
import {pickPaletteColor} from '@/lib/colorHelper';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';

const {t} = useTranslation();

const lyricsSize = ref<'small' | 'full'>('small');
const content = ref<VueDivElement>();
const lyricsContainer = ref<HTMLElement>();

const handleExpand = () => {
  if (!lyricsContainer.value) return;

  lyricsSize.value = lyricsSize.value == 'small'
      ? 'full'
      : 'small';

  if (lyricsSize.value == 'small') {
    // @ts-ignore
    content.value?.$el?.scrollToTop(window.innerHeight);
    setTimeout(() => {
      lyricsContainer.value!.style.height = '25rem';
    }, 200);
  } else {
    lyricsContainer.value!.style.height = `${window.innerHeight * 0.85}px`;
    setTimeout(() => {
      // @ts-ignore
      content.value.$el?.scrollToBottom(window.innerHeight);
    }, 200);
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

const onWillDismiss = async () => {
  fullPlayerModalOpen.value = false;
};

const focusColor = computed(() => {
  if (!useAutoThemeColors.value) return 'var(--color-theme-7)';

  return pickPaletteColor(currentSong.value?.color_palette?.cover, 10, 160)
      .replace(/,/gu, ' ')
      .replace('rgb(', '');
});

</script>

<template>
  <ion-modal
      :is-open="fullPlayerModalOpen"
      @willDismiss="onWillDismiss"
      :initial-breakpoint="1"
      :breakpoints="[0, 1]"
      id="fullPlayer"
      class=""
  >
    <ion-content ref="content" :fullscreen="true" :style="`--color-focus: ${focusColor}`">
      <div
          class="pt-safe relative z-0 flex h-screen min-h-screen flex-col items-center justify-between gap-2 px-6 w-inherit scrollbar-none text-slate-light-12 dark:text-slate-dark-12">
        <div class="pointer-events-none absolute inset-0 w-full  bg-spotifyBottom bg-focus transition-all duration-500"></div>

        <TopRow/>

        <div class="w-full max-w-2xl h-auto aspect-square">
          <CoverImage
              :data="currentSong"
              v-if="currentSong"
              :size="320"
              className="pointer-events-none relative aspect-square h-auto overflow-clip rounded-md w-inherit"/>
        </div>

        <TrackRow/>

        <ProgressBarContainer
            class="children:!mx-0 gap-4"
        />
        <ButtonContainer/>
      </div>

      <div class="relative mx-3 -mt-10 mb-3 rounded-2xl pt-10 pb-4 w-available bg-focus/60">
        <div class="absolute top-0 z-10 flex w-full items-center rounded-t-2xl pr-2 pl-4 font-semibold">
          <span>{{ t('Lyrics') }}</span>
          <MusicButton label="expand"
                       class="ml-auto"
                       :onclick="handleExpand">
            <MoooomIcon v-if="lyricsSize == 'full'" icon="arrowExitFullscreen" class="h-5 w-5"/>
            <MoooomIcon v-else icon="arrowEnterFullscreen" class="h-5 w-5"/>
          </MusicButton>
        </div>
        <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black opacity-3">
        </div>

        <div
            ref="lyricsContainer"
            class="relative w-full mb-0 flex-col overflow-auto scroll-smooth rounded-b-2xl p-4 transition-transform duration-150 h-[25rem]"
        >
          <LyricsOverlay class="sm:hidden"/>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<style scoped>
ion-modal {
  --height: 100%;
  --ion-color-step-350: transparent;
}

ion-modal::part(content) {
  border-radius: 0;
}
ion-content::part(background) {
  @apply bg-slate-light-1 dark:bg-slate-dark-1;
}
</style>
