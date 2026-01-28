import { computed, ref } from 'vue';
import type { Component } from '@/lib/routerHelper';

const indexer = ref<boolean>(false);
export const indexerState = computed(() => indexer.value);

export function toggleIndexer() {
	indexer.value = !indexer.value;
}

export function setIndexerOpen(open: boolean) {
	indexer.value = open;
}

export const isIndexerOpen = () => indexer.value;

// Track items for indexer letter availability
const indexerItems = ref<Component<any>[]>([]);

export function setIndexerItems(items: Component<any>[]) {
	indexerItems.value = items;
}

// Get available letters from the items data
export const availableLetters = computed(() => {
	const letters = new Set<string>();

	indexerItems.value?.forEach((item: any) => {
		const title = item.props?.data?.title
			|| item.props?.data?.name
			|| item.props?.name
			|| '';

		if (title) {
			const firstChar = title.charAt(0).toUpperCase();
			// Check if it's a letter or number
			if (/[A-Z0-9]/.test(firstChar)) {
				letters.add(firstChar);
			}
			else {
				// Non-alphanumeric goes to '#'
				letters.add('#');
			}
		}
	});

	return letters;
});

// Scroll to a specific letter using item index
export function scrollToLetter(letter: string, items: Component<any>[], scrollToIndex: (index: number) => void) {
	const targetLetter = letter === '#' ? letter : letter.toUpperCase();

	const index = items.findIndex((item: any) => {
		const title = item.props?.data?.title
			|| item.props?.data?.name
			|| item.props?.name
			|| '';

		if (!title)
			return false;

		const firstChar = title.charAt(0).toUpperCase();

		if (targetLetter === '#') {
			return !/[A-Z0-9]/.test(firstChar);
		}

		return firstChar === targetLetter;
	});

	if (index >= 0) {
		scrollToIndex(index);
	}
}

export default indexer;
