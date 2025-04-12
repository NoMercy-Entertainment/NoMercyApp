import { computed, onMounted, ref, watch } from 'vue';
import { refDebounced, useIntersectionObserver } from '@vueuse/core';

import type { HomeDataItem } from '@/types/api/music';
import type { Component } from '@/lib/routerHelper';
import type { Movie, Person, Tv } from '@/types/api/base/info';

import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { tmdbApiKey } from '@/config/config';
import i18next from "i18next";

export const searchResultLoading = ref(false);

export const searchType = ref<'video' | 'music'>('video');

export const musicSearchValue = ref('');
export const musicSearchResult = computed(() => musicResult.value);

const debouncedMusicSearchValue = refDebounced(musicSearchValue, 700);
const musicResult = ref<Component<HomeDataItem>[]>([]);

watch(debouncedMusicSearchValue, (value) => {
	if (value === '') {
		musicResult.value = [];
		return;
	}

	searchResultLoading.value = true;
	const url = `${currentServer.value?.serverBaseUrl}/api/v1/music/search?query=${value}`;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${user.value?.accessToken}`
		}
	})
		.then(response => response.json())
		.then(data => {
			musicResult.value = data.data;
			searchResultLoading.value = false;
		});
});


export const videoSearchValue = ref('');
export const hasMoreResults = ref(false);
export const videoSearchResult = computed(() => videoResult.value);

const videoResult = ref<Array<Movie | Tv | Person & any>>([]);
const debouncedVideoSearchValue = refDebounced(videoSearchValue, 700);
const page = ref(1);

watch(debouncedVideoSearchValue, (value) => {
	if (value === '') {
		videoResult.value = [];
		return;
	}

	hasMoreResults.value = false;
	searchResultLoading.value = true;

	page.value = 1; // Reset page number on new search
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=${i18next.language}&query=${value}&page=${page.value}&include_adult=false`;
		fetch(url)
		.then(response => response.json())
		.then(data => {
			videoResult.value = data.results;
			hasMoreResults.value = data.total_pages > 1;
			searchResultLoading.value = false;
		});
});

export const fetchNextPage = () => {
	page.value += 1;
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=${i18next.language}&query=${debouncedVideoSearchValue.value}&page=${page.value}&include_adult=false`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			videoResult.value = [...videoResult.value, ...data.results];
			if (data.results.length === 0) {
				hasMoreResults.value = false;
			} else {
				hasMoreResults.value = data.total_pages > page.value;
			}
		});
}

const loadMore = ref(null);
const { stop } = useIntersectionObserver(
	loadMore,
	([{ isIntersecting }], observerElement) => {
		if (isIntersecting) {
			fetchNextPage()
		}
	},
);

onMounted(() => {
	stop();
});

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
	} else {
		videoSearchValue.value = '';
		musicSearchValue.value = searchValue.value;
	}
});

watch(searchValue, (value) => {
	if (searchType.value === 'video') {
		videoSearchValue.value = value;
		musicSearchValue.value = '';
	} else {
		videoSearchValue.value = '';
		musicSearchValue.value = value;
	}
});
