import { ref, watch } from 'vue';

import type { LibrariesResponse } from '@/types/api/base/library';
import { currentServer } from '@/store/currentServer';

const libraries = ref<LibrariesResponse[]>([]);

export function setLibraries(newLibraries: LibrariesResponse[]): void {
	libraries.value = newLibraries;
}

export function getLibraries(): LibrariesResponse[] {
	return libraries.value;
}

export function clearLibraries(): void {
	libraries.value = [];
}

export default libraries;

export const shouldShowLibraryLinks = ref((libraries.value?.length ?? 0) > 0);

watch(libraries, (value) => {
	shouldShowLibraryLinks.value = (value?.length ?? 0) > 0;
});

watch(currentServer, (value) => {
	if (!value) {
		shouldShowLibraryLinks.value = false;
	}
});
