import { computed, ref } from 'vue';
import type { PlayerState } from '@/types/videoPlayer.ts';

const vs = ref<PlayerState>(<PlayerState>{});
export const videoPlayerState = computed(() => vs.value);

export function setVideoPlayerState(state: PlayerState) {
	vs.value = state;
}
