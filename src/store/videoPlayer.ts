import { computed, ref } from 'vue';
import type { PlayerState } from '@/types/videoPlayer.ts';

const playerStateData = ref<PlayerState>(<PlayerState>{});
export const videoPlayerState = computed(() => playerStateData.value);

export function setVideoPlayerState(state: PlayerState) {
	playerStateData.value = state;
}
