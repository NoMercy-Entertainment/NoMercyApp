import { ref } from 'vue';

import type { LibrariesResponse } from '@/types/api/base/library';

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
