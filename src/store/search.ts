import { computed, onMounted, ref, watch } from 'vue';
import { refDebounced, useIntersectionObserver } from '@vueuse/core';

import type { HomeDataItem } from '@/types/api/music';
import type { Component } from '@/lib/routerHelper';
import type { Movie, Person, Tv } from '@/types/api/base/info';

import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { tmdbApiKey } from '@/config/config';

export const musicSearchValue = ref('');
export const musicSearchResult = computed(() => musicResult.value);

const debouncedSearchValue = refDebounced(musicSearchValue, 500);
const musicResult = ref<Component<HomeDataItem>[]>([]);

watch(debouncedSearchValue, (value) => {
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
		});
});


export const videoSearchValue = ref('');
export const videoSearchResult = ref<Array<Movie | Tv | Person & any>>([]);
export const hasMoreResults = ref(false);

const debouncedVideoSearchValue = refDebounced(videoSearchValue, 500);
const page = ref(1);

watch(debouncedVideoSearchValue, (value) => {
	page.value = 1; // Reset page number on new search
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=en-US&query=${value}&page=${page.value}&include_adult=false`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			videoSearchResult.value = data.results;
			hasMoreResults.value = data.total_pages > 1;
		});
});

export const fetchNextPage = () => {
	page.value += 1;
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=en-US&query=${debouncedVideoSearchValue.value}&page=${page.value}&include_adult=false`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			videoSearchResult.value = [...videoSearchResult.value, ...data.results];
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
