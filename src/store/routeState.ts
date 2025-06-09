import { computed } from 'vue';

import libraries from '@/store/Libraries';
import router from '@/router';
import {useLocalStorage} from "@vueuse/core";

export const searchUrl = computed(() => {
  if (isMusicRoute.value) {
    return '/search?from=music';
  }
  return '/search';
});

export const redirectUrl = useLocalStorage('redirect-url', '/home');
export const isSearchRoute = computed(() => router.currentRoute.value.path == '/search');
export const isMusicSearchRoute = computed(() => router.currentRoute.value.path == '/music/search');

export const isHomeRoute = computed(() => router.currentRoute.value.path == '/home' || router.currentRoute.value.path == '/');
export const isMusicRoute = computed(() => router.currentRoute.value.path.startsWith('/music'));
export const isLibraryRoute = computed(() => router.currentRoute.value.path.startsWith('/libraries') || router.currentRoute.value.path.startsWith('/library'));
export const isDashboardRoute = computed(() => router.currentRoute.value.path.startsWith('/dashboard'));
export const isPreferencesRoute = computed(() => router.currentRoute.value.path.startsWith('/preferences'));
export const hasMusicLibrary = computed(() => libraries.value?.some?.(l => l.type != 'music'));
export const isAlbumRoute = computed(() => router.currentRoute.value.path.startsWith('/music/album'));
export const isArtistRoute = computed(() => router.currentRoute.value.path.startsWith('/music/artist'));
export const isPlaylistRoute = computed(() => router.currentRoute.value.path.startsWith('/music/playlist'));
export const isSongRoute = computed(() => router.currentRoute.value.path.startsWith('/music/song'));
export const isQueueRoute = computed(() => router.currentRoute.value.path.startsWith('/music/queue'));
export const isTrackRoute = computed(() => router.currentRoute.value.path.startsWith('/music/artist/') || router.currentRoute.value.path.startsWith('/music/album/'));

