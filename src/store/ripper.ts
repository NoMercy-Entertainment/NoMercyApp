import { computed, ref } from 'vue';
import {
	deviceMenuOpen,
	equalizerMenuOpen,
	lyricsMenuOpen,
	queueMenuOpen,
} from '@/store/audioPlayer';
import type { BluRayPlaylist, DriveState } from '@/types/api/dashboard/ripper';

const rmOpen = ref(false);
export const ripperMenuOpen = computed(() => rmOpen.value);

export function setRipperMenuOpen(value: boolean): void {
	rmOpen.value = value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}
export function toggleRipperMenuOpen(): void {
	rmOpen.value = !rmOpen.value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export const discs = ref<DriveState[]>([]);
export const discContents = ref<DriveState>();

export const ripperPlaylist = ref<BluRayPlaylist | null>();
export const ripperPlaylistLoading = ref(false);

export const lastShownDisc = ref<string | null>(null);
