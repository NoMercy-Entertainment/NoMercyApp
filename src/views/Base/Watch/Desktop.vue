<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useTranslation} from 'i18next-vue';
import {IonPage, isPlatform} from '@ionic/vue';
import {App} from '@capacitor/app';

import currentServer from '@/store/currentServer';
import user from '@/store/user';
import {setDisableScreensaver} from '@/store/imageModal';
import MediaSession from '@/lib/MediaSession';
import {lockLandscape, lockPortrait, unlockOrientation} from '@/lib/utils';
import {isNative} from '@/config/global';
import {NavigationBar} from '@hugotomazi/capacitor-navigation-bar';

import type {
  NMPlayer,
  PlaylistItem,
  SetupConfig
} from '@/lib/VideoPlayer';
import {
  nmplayer,
  OctopusPlugin,
  DesktopUIPlugin,
  KeyHandlerPlugin,
  SyncPlugin,
  AutoSkipPlugin
} from '@/lib/VideoPlayer';
import {pad} from '@/lib/stringArray';
import {hideStatusbar, showStatusbar} from '@/store/ui';

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
}

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

onMounted(() => {
  // @ts-ignore
  player.value ??= nmplayer('player1')
      .setup(config);

  player.value?.once('back', () => {
    console.log('back');
    // history.back();
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

  const keyHandlerPlugin = new KeyHandlerPlugin();
  player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
  player.value?.usePlugin('keyHandler');

  const syncPlugin = new SyncPlugin();
  player.value?.registerPlugin('sync', syncPlugin);
  player.value?.usePlugin('sync');

  player.value?.once('play', () => {
    player.value?.enterFullscreen();
    // player.value?.emit('quality');

    // //@ts-ignore
    // let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // //@ts-ignore
    // let source = audioCtx.createMediaElementSource(document.querySelector('video'));
    //
    // let gainNode = audioCtx.createGain();
    // //@ts-ignore
    // window.gainNode = gainNode;
    // gainNode.gain.value = 1;
    // source.connect(gainNode);
    // gainNode.connect(audioCtx.destination);
  });

  player.value?.on('playlistComplete', () => {
    history.back();
  });

  player.value?.on('play', () => {
    setDisableScreensaver(true);
    if (isNative) {
      // @ts-ignore
      hideStatusbar();
      // NavigationBar.hide();
    }
    mediaSession.setPlaybackState('playing');
  });

  player.value?.on('pause', () => {
    setDisableScreensaver(false);
    if (isNative) {
      // @ts-ignore
      showStatusbar();
      // NavigationBar.show();
    }
    mediaSession.setPlaybackState('paused');
  });

  player.value?.on('ready', () => {
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

  App.addListener('backButton', () => {
      player.value?.emit('back-button-hyjack');
    history.back();
  });

  if (isNative) {
    player.value?.on('fullscreen', (value: any) => {
      if (value) {
        if (isNative) {
          hideStatusbar();
        }
        lockLandscape();
        NavigationBar.hide();
      } else {
        if (isNative) {
          showStatusbar();
        }
        unlockOrientation();
      }
    });
    player.value?.on('controls', (value: any) => {
      if (value) {
        NavigationBar.show();
      } else {
        if (isNative) {
          hideStatusbar();
        }
      }
    });
  }

  document.dispatchEvent(new Event('sidebar'));
  lockLandscape();
});

onUnmounted(() => {
  setDisableScreensaver(false);
  if (isNative) {
    showStatusbar();
  }
  lockPortrait();
  player.value?.dispose();
});
</script>

<template>
  <ion-page>
      <Teleport to="body">
        <div class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199"
             :class="{
             'mb-28': isNative,
             'mb-0': !isNative,
           }">
          <div id="player1" class="group nomercyplayer bg-white/20 bg-white"></div>
        </div>
      </Teleport>
  </ion-page>
</template>

<style scoped lang="css">
@import 'nomercyplayer/dist/style.css';
</style>
