<script setup lang="ts">
import {onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useTranslation} from 'i18next-vue';
import {IonContent, IonPage, isPlatform} from '@ionic/vue';
import {App} from '@capacitor/app';

import MediaSession from '@/lib/MediaSession';
import {disableImmersiveMode, enableImmersiveMode, lockLandscape, lockPortrait} from '@/lib/utils';
import {isNative} from '@/config/global';
import {currentServer} from '@/store/currentServer';
import {user} from '@/store/user';
import {setDisableScreensaver} from '@/store/imageModal';

import type {NMPlayer, PlaylistItem, SetupConfig} from '@/lib/VideoPlayer';
import {
  AutoSkipPlugin,
  TVUIPlugin,
  KeyHandlerPlugin,
  nmplayer,
  OctopusPlugin,
  SyncPlugin
} from '@/lib/VideoPlayer';
import {pad} from '@/lib/stringArray';

import audioPlayer from '@/store/audioPlayer';
import router from "@/router";
import {hideNavBar, showNavBar} from "@/store/ui";

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
  accessToken: user.value?.accessToken,
  basePath: currentServer.value?.serverBaseUrl,
  forceTvMode: (isPlatform('android') || isPlatform('ios')) && !isPlatform('mobile'),
  disableTouchControls: false,
  disableMediaControls: 'mediaSession' in navigator || isPlatform('capacitor'),
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
const mediaSession = new MediaSession();

const goBack =  () => {
  player.value?.emit('back-button');
  player.value?.emit('back-button-hyjack');
}

onMounted(() => {
  lockLandscape();
  enableImmersiveMode();
  // @ts-ignore
  player.value ??= nmplayer('player1')
      .setup(config);

  const tvUIPlugin = new TVUIPlugin();
  player.value?.registerPlugin('tvUI', tvUIPlugin);
  player.value?.usePlugin('tvUI');

  const octopusPlugin = new OctopusPlugin();
  player.value?.registerPlugin('octopus', octopusPlugin);
  player.value?.usePlugin('octopus');

  const autoSkipPlugin = new AutoSkipPlugin();
  player.value?.registerPlugin('autoSkip', autoSkipPlugin);
  player.value?.usePlugin('autoSkip');

  // const sabrePlugin = new SabrePlugin();
  // player.value?.registerPlugin('sabre', sabrePlugin);
  // player.value?.usePlugin('sabre');

  const keyHandlerPlugin = new KeyHandlerPlugin();
  player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
  player.value?.usePlugin('keyHandler');

  const syncPlugin = new SyncPlugin();
  player.value?.registerPlugin('sync', syncPlugin);
  player.value?.usePlugin('sync');

  player.value?.once('play', () => {
    player.value?.enterFullscreen();
  });

  player.value?.once('back', () => {
  });

  player.value?.on('playlistComplete', () => {
    //
  });

  player.value?.on('play', () => {
    setDisableScreensaver(true);
    mediaSession.setPlaybackState('playing');
  });

  player.value?.on('pause', () => {
    setDisableScreensaver(false);
    mediaSession.setPlaybackState('paused');
  });

  player.value?.on('ready', () => {
    hideNavBar();
    audioPlayer.value?.stop();
    mediaSession.setActionHandler({
      play: () => player.value?.play(),
      pause: () => player.value?.pause(),
      stop: () => player.value?.stop(),
      previous: () => player.value?.previous(),
      next: () => player.value?.next(),
      seek: (n) => player.value?.seek(n),
      getPosition: () => player.value?.getCurrentTime() || 0,
    });
  });

  player.value?.on('time', (data: any) => {
    mediaSession.setPositionState({
      position: data.currentTime,
      duration: data.duration,
      playbackRate: data.playbackRate,
    });
  });

  player.value?.on('lastTimeTrigger', () => {
  });

  player.value?.on('item', (playlistItem: PlaylistItem) => {

    const parsedTitle = playlistItem.title
        .replace('%S', t('S'))
        .replace('%E', t('E'));

    mediaSession.setMetadata({
      title: parsedTitle,
      artist: playlistItem.show ?? undefined,
      album: playlistItem.season
          // @ts-ignore
          ? `${t('S')}${pad(playlistItem.season, 2)}${t('E')}${pad(playlistItem.episode, 2)}`
          : undefined,
      artwork: playlistItem.image?.replace('w300', 'w500'),
    });

    player.value?.play();
  });

  player.value?.on('active', (value) => {
    if (value) {
      //
    } else {
      //
    }
  });

  player.value?.on('error', () => {
    mediaSession?.setPlaybackState('none');
  });

  player.value?.on('dispose', () => {
    mediaSession?.setPlaybackState('none');
    router.back();
    showNavBar();
  });

  App.addListener('backButton', goBack);

});

onBeforeUnmount(() => {
  lockPortrait();
  disableImmersiveMode();
});

onUnmounted(() => {
  setDisableScreensaver(false);
  player.value?.dispose();
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
<!--      <Teleport to="body">-->
        <div class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199"
             :class="{
             'mb-28': isNative,
             'mb-0': !isNative,
           }">
          <div id="player1" class="group nomercyplayer"></div>
        </div>
<!--      </Teleport>-->
    </ion-content>
  </ion-page>
</template>

<style>
.nomercyplayer .top-bar {
  @apply pt-safe-offset-4;
}
.nomercyplayer .seek-container {
  @apply mb-28;
}
</style>
