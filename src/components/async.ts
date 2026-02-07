import { defineAsyncComponent } from 'vue';

import MusicPlayerSkeleton from '@/components/Loading/MusicPlayerSkeleton.vue';

export const AsyncMusicPlayerDesktop = defineAsyncComponent({
	loader: () => import('@/components/MusicPlayer/MusicPlayerDesktop.vue'),
	loadingComponent: MusicPlayerSkeleton,
	delay: 200,
});

export const AsyncMusicPlayerFull = defineAsyncComponent({
	loader: () => import('@/components/MusicPlayer/mobile/FullPlayer.vue'),
	delay: 200,
});

export const AsyncMusicPlayerMini = defineAsyncComponent({
	loader: () => import('@/components/MusicPlayer/mobile/MiniPlayer.vue'),
	delay: 200,
});
