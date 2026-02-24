import { defineAsyncComponent } from 'vue';

export const AsyncMusicPlayerDesktop = defineAsyncComponent(
	() => import('@/components/MusicPlayer/MusicPlayerDesktop.vue'),
);

export const AsyncMusicPlayerFull = defineAsyncComponent({
	loader: () => import('@/components/MusicPlayer/mobile/FullPlayer.vue'),
	delay: 200,
});

export const AsyncMusicPlayerMini = defineAsyncComponent({
	loader: () => import('@/components/MusicPlayer/mobile/MiniPlayer.vue'),
	delay: 200,
});
