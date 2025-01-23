import { computed, ref } from 'vue';

const indexer = ref<boolean>(false);
export const indexerState = computed(() => indexer.value);

export const toggleIndexer = () => {
	indexer.value = !indexer.value;
};

export const setIndexerOpen = (open: boolean) => {
	indexer.value = open;
}

export const isIndexerOpen = () => indexer.value;

export default indexer;
