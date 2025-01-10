<script setup lang="ts">
import {onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useTranslation} from 'i18next-vue';
import {IonContent, IonPage, isPlatform} from '@ionic/vue';
import {App} from '@capacitor/app';

import {disableImmersiveMode, enableImmersiveMode, lockLandscape, lockPortrait} from '@/lib/utils';
import {isNative} from '@/config/global';
import {currentServer} from '@/store/currentServer';
import {user} from '@/store/user';
import {setDisableScreensaver} from '@/store/imageModal';

import type {NMPlayer, PlaylistItem, SetupConfig} from '@/lib/VideoPlayer';
import {
  AutoSkipPlugin,
  DesktopUIPlugin,
  nmplayer,
  OctopusPlugin,
  SyncPlugin
} from '@/lib/VideoPlayer';

import audioPlayer from '@/store/audioPlayer';
import router from "@/router";

const {t} = useTranslation();
const route = useRoute();

const config: SetupConfig = {
  muted: false,
  controls: false,
  preload: 'auto',
  debug: false,
  autoPlay: true,
  playlist: `${currentServer.value?.serverApiUrl}${route.fullPath}`,

  controlsTimeout: 3000,
  doubleClickDelay: 500,
  playbackRates: [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    1.75,
    2,
  ],
  accessToken: user.value?.accessToken || localStorage.getItem('access_token') || '',
  basePath: currentServer.value?.serverBaseUrl,
  forceTvMode: (isPlatform('android') || isPlatform('ios')) && !isPlatform('mobile'),
  disableTouchControls: false,
  disableMediaControls: 'mediaSession' in navigator || isPlatform('capacitor'),
  renderAhead: 100,
};

interface MyNmPlayer extends NMPlayer {
  showInProduction: () => boolean;
  getPlaylistItem: () => PlaylistItem & {
    tmdb_id: number,
    special_id: number,
    video_type: string,
    video_id: number;
  };
}

const player = ref<MyNmPlayer>();

onMounted(() => {
  // @ts-ignore
  player.value ??= nmplayer('player1')
      .setup(config);

  player.value?.once('back', () => {
    //
  });

  const desktopUIPlugin = new DesktopUIPlugin();
  player.value?.registerPlugin('desktopUI', desktopUIPlugin);
  player.value?.usePlugin('desktopUI');

  const octopusPlugin = new OctopusPlugin();
  player.value?.registerPlugin('octopus', octopusPlugin);
  player.value?.usePlugin('octopus');

  const autoSkipPlugin = new AutoSkipPlugin();
  player.value?.registerPlugin('autoSkip', autoSkipPlugin);
  player.value?.usePlugin('autoSkip');

  // const sabrePlugin = new SabrePlugin();
  // player.value?.registerPlugin('sabre', sabrePlugin);
  // player.value?.usePlugin('sabre');

  const syncPlugin = new SyncPlugin();
  player.value?.registerPlugin('sync', syncPlugin);
  player.value?.usePlugin('sync');

  player.value?.once('play', () => {
    player.value?.enterFullscreen();
  });

  player.value?.on('playlistComplete', () => {
    player.value?.dispose();
    router.back();
  });

  player.value?.on('back', () => {
    router.back();
  });

  player.value?.on('play', () => {
    setDisableScreensaver(true);
  });

  player.value?.on('pause', () => {
    setDisableScreensaver(false);
  });

  player.value?.on('ready', () => {
    lockLandscape();
    enableImmersiveMode();
    audioPlayer.stop();
  });

  player.value?.on('item', (playlistItem: PlaylistItem) => {
    player.value?.play();
  });

  player.value?.on('active', (value) => {
    if (value) {
      //
    } else {
      //
    }
  });

  App.addListener('backButton', () => {
    player.value?.emit('back-button-hyjack');
    router.back();
  });

  document.dispatchEvent(new Event('sidebar'));
});

onBeforeUnmount(() => {
  lockPortrait();
  disableImmersiveMode();
});

onUnmounted(() => {
  player.value?.dispose();
  setDisableScreensaver(false);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Teleport to="body">
        <div class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199"
             :class="{
             'mb-28': isNative,
             'mb-0': !isNative,
           }">
          <div id="player1" class="group nomercyplayer"></div>
        </div>
      </Teleport>
    </ion-content>
  </ion-page>
</template>

<style>
.nomercyplayer .top-bar {
  @apply pt-safe-offset-4;
}
</style>
