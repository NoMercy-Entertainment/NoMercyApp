<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage, isPlatform } from '@ionic/vue';
import { App } from '@capacitor/app';

import { isNative } from '@/config/global';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { setDisableScreensaver } from '@/store/imageModal';

import type { NMPlayer, PlaylistItem, PlayerConfig } from '@/lib/VideoPlayer';
import {
  AutoSkipPlugin,
  TVUIPlugin,
  KeyHandlerPlugin,
  nmplayer,
  OctopusPlugin,
  SyncPlugin
} from '@/lib/VideoPlayer';

import audioPlayer from '@/store/audioPlayer';
import router from "@/router";
import { hideNavBar, setNavBarVisible, showNavBar } from "@/store/ui";
import useServerClient from "@/lib/clients/useServerClient";

interface MyNmPlayer extends NMPlayer {
  showInProduction: () => boolean;
  getPlaylistItem: () => PlaylistItem & {
    tmdb_id: number,
    special_id: number,
    video_type: string,
    video_id: number;
  };
}

const { data } = useServerClient<PlaylistItem[]>({

});

const player = ref<MyNmPlayer>();

const goBack = () => {
  player.value?.emit('back-button');
  player.value?.emit('back-button-hyjack');
}

const initPlayer = (value: PlaylistItem[] | undefined) => {

  const config: PlayerConfig = {
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
    accessToken: user.value?.accessToken || localStorage.getItem('access_token') || '',
    basePath: currentServer.value?.serverBaseUrl,
    forceTvMode: (isPlatform('android') || isPlatform('ios')) && !isPlatform('mobile'),
    disableTouchControls: false,
    disableMediaControls: 'mediaSession' in navigator || isPlatform('capacitor'),
    renderAhead: 10,
    customStorage: {
      set: (key, value) => {
        return new Promise<void>((resolve) => {
          localStorage.setItem(key, value);
          resolve();
        });
      },
      get: (key) => {
        return new Promise<string|null>((resolve) => {
          resolve(localStorage.getItem(key));
        });
      },
      remove: (key) => {
        return new Promise<void>((resolve) => {
          localStorage.removeItem(key);
          resolve();
        });
      },
    },
  };

  player.value?.dispose();

  // @ts-ignore
  player.value = nmplayer('player1')
    .setup(config);

  const tvUIPlugin = new TVUIPlugin();
  player.value?.registerPlugin('tvUI', tvUIPlugin);
  player.value?.usePlugin('tvUI');

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

  player.value?.once('back', () => {
  });

  player.value?.on('playlistComplete', () => {
    player.value?.dispose();
    router.back();
  });

  player.value?.on('play', () => {
    setDisableScreensaver(true);
  });

  player.value?.on('pause', () => {
    setDisableScreensaver(false);
  });

  player.value?.on('ready', () => {
    hideNavBar();
    audioPlayer.stop();
  });

  player.value?.on('item', () => {
    player.value?.play();
  });

  player.value?.on('active', (value) => {
    if (value) {
      //
    } else {
      //
    }
  });

  // player.value?.on('dispose', () => {
  //   router.back();
  //   showNavBar();
  // });

  App.addListener('backButton', goBack);

};

watch(data, (value) => {
  if (!value) return;
  initPlayer(value);
});

onMounted(() => {
  setNavBarVisible(false);
  if (data.value) {
    initPlayer(data.value);
  }
});

onUnmounted(() => {
  setDisableScreensaver(false);
  showNavBar();
  player.value?.dispose();
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!--      <Teleport to="body">-->
      <div class="absolute inset-0 flex h-full w-full overflow-clip bg-black z-1199" :class="{
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
  padding-top: calc(var(--safe-area-inset-top, 0px) + 1rem);
}
.nomercyplayer #pre-screen-dialog {
  background: #000000cc;
}
</style>
