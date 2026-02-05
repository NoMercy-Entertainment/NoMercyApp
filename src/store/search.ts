import { computed, ref, watch } from 'vue';
import { refDebounced, useIntersectionObserver } from '@vueuse/core';

import type { HomeDataItem } from '@/types/api/music';
import type { Component } from '@/lib/routerHelper';
import type { Movie, Person, Tv } from '@/types/api/base/info';

import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { tmdbApiKey } from '@/config/config';
import i18next from 'i18next';

export const searchResultLoading = ref(false);

export const searchType = ref<'video' | 'music'>('video');

export const musicSearchValue = ref('');
const musicResult = ref<Component<HomeDataItem>[]>([]);
export const musicSearchResult = computed(() => musicResult.value);

const debouncedMusicSearchValue = refDebounced(musicSearchValue, 700);

watch(debouncedMusicSearchValue, async (value) => {
	if (value === '') {
		musicResult.value = [];
		return;
	}

	searchResultLoading.value = true;
	const url = `${currentServer.value?.serverBaseUrl}/api/v1/music/search?query=${value}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.value?.accessToken}`,
			},
		});
		const data = await response.json();
		musicResult.value = data.data;
	}
	catch (err) {
		console.error('Music search failed:', err);
	}
	finally {
		searchResultLoading.value = false;
	}
});

export const videoSearchValue = ref('');
export const hasMoreResults = ref(false);
const videoResult = ref<Array<Movie | Tv | (Person & any)>>([]);
export const videoSearchResult = computed(() => videoResult.value);

const debouncedVideoSearchValue = refDebounced(videoSearchValue, 700);
const page = ref(1);

watch(debouncedVideoSearchValue, async (value) => {
	if (value === '') {
		videoResult.value = [];
		return;
	}

	hasMoreResults.value = false;
	searchResultLoading.value = true;

	page.value = 1;
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=${i18next.language}&query=${value}&page=${page.value}&include_adult=false`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		videoResult.value = data.results;
		hasMoreResults.value = data.total_pages > 1;
	}
	catch (err) {
		console.error('Video search failed:', err);
	}
	finally {
		searchResultLoading.value = false;
	}
});

export async function fetchNextPage(): Promise<void> {
	page.value += 1;
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=${i18next.language}&query=${debouncedVideoSearchValue.value}&page=${page.value}&include_adult=false`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		videoResult.value = [...videoResult.value, ...data.results];
		if (data.results.length === 0) {
			hasMoreResults.value = false;
		}
		else {
			hasMoreResults.value = data.total_pages > page.value;
		}
	}
	catch (err) {
		console.error('Fetch next page failed:', err);
	}
}

const loadMore = ref(null);
const { stop } = useIntersectionObserver(
	loadMore,
	([{ isIntersecting }], observerElement) => {
		if (isIntersecting) {
			fetchNextPage();
		}
	},
);

export const search = ref();
export const searchValue = ref('');

export const displayResults = computed(() => {
	return searchType.value === 'video'
		? videoSearchResult.value
		: musicSearchResult.value;
});

watch(searchType, (value) => {
	if (value === 'video') {
		musicSearchValue.value = '';
		videoSearchValue.value = searchValue.value;
	}
	else {
		videoSearchValue.value = '';
		musicSearchValue.value = searchValue.value;
	}
});

watch(searchValue, (value) => {
	if (searchType.value === 'video') {
		videoSearchValue.value = value;
		musicSearchValue.value = '';
	}
	else {
		videoSearchValue.value = '';
		musicSearchValue.value = value;
	}
});
