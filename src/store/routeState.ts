import {computed} from 'vue';

import router from '@/router';
import libraries from '@/store/Libraries';

export const searchUrl = computed(() => {
  if (isMusicRoute.value) {
    return '/music/search';
  }
  return '/search';
});

export const isSearchRoute = computed(() => router.currentRoute.value.fullPath == '/search');
export const isMusicSearchRoute = computed(() => router.currentRoute.value.fullPath == '/music/search');

export const isHomeRoute = computed(() => router.currentRoute.value.fullPath == '/home' || router.currentRoute.value.fullPath == '/');
export const isMusicRoute = computed(() => router.currentRoute.value.fullPath.startsWith('/music'));
export const isLibraryRoute = computed(() => router.currentRoute.value.fullPath.startsWith('/libraries') || router.currentRoute.value.fullPath.startsWith('/library'));
export const isDashboardRoute = computed(() => router.currentRoute.value.fullPath.startsWith('/dashboard'));
export const isPreferencesRoute = computed(() => router.currentRoute.value.fullPath.startsWith('/preferences'));
export const hasMusicLibrary = computed(() => libraries.value?.some?.(l => l.type != 'music'));

