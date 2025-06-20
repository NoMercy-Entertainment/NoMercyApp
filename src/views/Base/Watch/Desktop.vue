<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {IonPage, isPlatform} from '@ionic/vue';

import { setDisableScreensaver } from '@/store/imageModal';

import type {
  NMPlayer,
  PlaylistItem,
  PlayerConfig, NMPlaylistItem
} from '@/lib/VideoPlayer';
import {
  nmplayer,
  OctopusPlugin,
  DesktopUIPlugin,
  KeyHandlerPlugin,
  SyncPlugin,
  AutoSkipPlugin
} from '@/lib/VideoPlayer';
import router from '@/router';
import audioPlayer from '@/store/audioPlayer';

import useServerClient from "@/lib/clients/useServerClient";
import {currentServer} from "@/store/currentServer";
import {user} from "@/store/user";

const { data } = useServerClient<NMPlaylistItem[]>();

const player = ref<NMPlayer<PlaylistItem>>();

const initPlayer = (value: NMPlaylistItem[] | undefined) => {

  const config: Partial<PlayerConfig<PlaylistItem>> = {
    muted: false,
    controls: false,
    preload: 'auto',
    debug: false,
    autoPlay: true,
    playlist: value?.filter(item => !!item.id) ?? [],
    controlsTimeout: 3000,
    doubleClickDelay: 300,
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
    renderAhead: 100,
  } satisfies PlayerConfig<PlaylistItem>;

  // @ts-ignore
  player.value = nmplayer('player1').setup(config);

  player.value?.once('back', () => {
    router.back();
  });

  const desktopUIPlugin = new DesktopUIPlugin();
  player.value?.registerPlugin('desktopUI', desktopUIPlugin);
  player.value?.usePlugin('desktopUI');

  const autoSkipPlugin = new AutoSkipPlugin();
  player.value?.registerPlugin('autoSkip', autoSkipPlugin);
  player.value?.usePlugin('autoSkip');

  const keyHandlerPlugin = new KeyHandlerPlugin();
  player.value?.registerPlugin('keyHandler', keyHandlerPlugin);
  player.value?.usePlugin('keyHandler');

  const syncPlugin = new SyncPlugin();
  player.value?.registerPlugin('sync', syncPlugin);
  player.value?.usePlugin('sync');

  const octopusPlugin = new OctopusPlugin();
  player.value?.registerPlugin('octopus', octopusPlugin);
  player.value?.usePlugin('octopus');

  // const sabrePlugin = new SabrePlugin();
  // player.value?.registerPlugin('sabre', sabrePlugin);
  // player.value?.usePlugin('sabre');

  player.value?.once('play', () => {
    player.value?.enterFullscreen();
  });

  player.value?.on('playlistComplete', () => {
    player.value?.dispose();
    router.back();
  });

  player.value?.once('back', () => {
  });

  player.value?.on('play', () => {
    setDisableScreensaver(true);
  });

  player.value?.on('pause', () => {
    setDisableScreensaver(false);
  });

  player.value?.on('fullscreen', (value) => {
    // @ts-ignore
    window.external?.sendMessage?.(value ? 'enterFullscreen' : 'exitFullscreen');
  });

  player.value?.on('ready', () => {

    audioPlayer.stop();

    const observer = new MutationObserver(mutationList =>
      mutationList.filter(m => m.type === 'childList').forEach(m => {
        m.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            if (node.tagName === 'VIDEO') {
              console.log('video removed');
            }
          }
        });
      }));

    const videoElement = player.value?.getVideoElement();
    if (videoElement) {
      observer.observe(videoElement, { childList: true, subtree: true });
    }
  });

  player.value?.on('item', () => {
    player.value?.play();
  });
}

watch(data, (value) => {
  player.value?.dispose();
  initPlayer(value);
});

onMounted(() => {
  player.value?.dispose();
  initPlayer(data.value);
});

onUnmounted(() => {
  player.value?.dispose();
  setDisableScreensaver(false);
});
</script>

<template>
  <ion-page>
    <div id="player1" class="group nomercyplayer"></div>
  </ion-page>
</template>

<style>
.nomercyplayer dialog {
  background: #000000cc;
}
</style>
