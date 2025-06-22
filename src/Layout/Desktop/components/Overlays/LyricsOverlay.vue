<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';

import type { Lyric } from '@/types/musicPlayer';

import { random_string } from '@/lib/stringArray';
import { scrollCenter } from '@/lib/utils';

import { user } from '@/store/user';
import { currentServer } from '@/store/currentServer';
import audioPlayer, {
	currentSong,
	currentTime,
	lyricsMenuOpen,
	setHasLyrics,
} from '@/store/audioPlayer';
import { setDisableScreensaver } from '@/store/imageModal';

import LyricItem from '@/Layout/Desktop/components/Overlays/LyricItem.vue';

const lyrics_container = ref<HTMLDivElement>();
const lyrics = ref<Lyric[] | undefined | null>(currentSong.value?.lyrics);
const id = ref(random_string(8));
const lastIndex = ref(-1);
const currentLyric = ref<HTMLDivElement>();

function fetchLyrics(id: string) {
	if (!id || currentSong.value?.lyrics)
		return;
	if (id === currentSong.value?.id)
		return;

	const lyricsUrl = `${currentServer.value?.serverApiUrl}/music/tracks/${id}/lyrics`;

	fetch(lyricsUrl, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${user.value.accessToken}`,
		},
	})
		.then(response => response.json())
		.then((data) => {
			setHasLyrics(data.data?.length > 0);
			lyrics.value = data.data;
		});
}

onBeforeMount(() => {
	lastIndex.value = -1;

	if (currentSong.value?.lyrics) {
		lyrics.value = currentSong.value.lyrics;
	}
	else if (currentSong.value?.id) {
		fetchLyrics(currentSong.value?.id);
	}
});

onMounted(() => {
	if (!lyrics_container.value || !currentLyric.value)
		return;

	lyrics_container.value.scrollTop = 0;

	audioPlayer.on('seeked', (data) => {
		if (!lyrics_container.value || !lyrics_container.value)
			return;

		const newIndex
      = (lyrics.value?.findIndex?.(l => l.time?.total >= data.position) ?? 0)
      	- 1;

		const elements = Array.from(
			lyrics_container.value?.querySelectorAll<HTMLDivElement>(
				'[data-lyric]',
			) ?? [],
		);

		if (newIndex === -1) {
			elements.forEach((el) => {
				el.style.opacity = '1';
				el.style.color = 'black';
			});

			currentLyric.value
        = lyrics_container.value.querySelector<HTMLDivElement>(
					`[data-index='0']`,
				)!;
			if (currentLyric.value && lyrics_container.value) {
				scrollCenter(currentLyric.value, lyrics_container.value, {
					duration: 500,
				});
			}
		}
		else if (newIndex === -2) {
			elements
				.filter(el => Number.parseInt(el.dataset.index!, 10) < newIndex)
				.forEach((el) => {
					el.style.opacity = '0.5';
					el.style.color = 'white';
				});

			currentLyric.value = lyrics_container.value.querySelector<HTMLDivElement>(
				`[data-index='${elements.length - 1}']`,
			)!;
			if (currentLyric.value && lyrics_container.value) {
				scrollCenter(currentLyric.value, lyrics_container.value, {
					duration: 500,
				});
			}
		}
	});
});

watch(currentTime, (value) => {
	if (!value || !lyrics_container.value || !lyrics.value)
		return;

	value = value + 0.5;

	const newIndex
    = (lyrics.value?.findIndex?.(l => l.time?.total >= value) ?? 0) - 1;

	if (newIndex === -1 && value > 1)
		return;
	if (lastIndex.value === newIndex)
		return;

	lastIndex.value = newIndex;

	const elements = Array.from(
		lyrics_container.value?.querySelectorAll<HTMLDivElement>('[data-lyric]')
		?? [],
	);

	elements
		.filter(el => Number.parseInt(el.dataset.index!, 10) < newIndex)
		.forEach((el) => {
			el.style.opacity = '0.5';
			el.style.color = 'white';
		});

	currentLyric.value = lyrics_container.value.querySelector<HTMLDivElement>(
		`[data-index='${newIndex}']`,
	)!;

	if (currentLyric.value) {
		currentLyric.value.style.opacity = '1';
		currentLyric.value.style.color = 'white';
		scrollCenter(currentLyric.value, lyrics_container.value, {
			duration: 500,
		});
	}

	elements
		.filter(el => Number.parseInt(el.dataset.index!, 10) > newIndex)
		.forEach((el) => {
			el.style.opacity = '1';
			el.style.color = 'black';
		});
});

watch(currentSong, (value, oldValue) => {
	if (value?.id === oldValue?.id)
		return;
	lastIndex.value = -1;

	if (value?.lyrics) {
		lyrics.value = value.lyrics;
	}
	else if (value?.id) {
		fetchLyrics(value?.id);
	}
});

watch(lyrics, (value, oldValue) => {
	if (!value || !lyrics_container.value)
		return;
	if (value.at(0) === oldValue?.at(0))
		return;

	const currentLyric
    = lyrics_container.value?.querySelector<HTMLDivElement>(`[data-index='0']`);
	if (currentLyric) {
		currentLyric.style.opacity = '1';
		currentLyric.style.color = 'white';
		scrollCenter(currentLyric, lyrics_container.value, {
			duration: 500,
		});
	}
	const elements = Array.from(
		lyrics_container.value?.querySelectorAll<HTMLDivElement>('[data-lyric]'),
	);

	nextTick(() => {
		elements.forEach((el) => {
			el.style.opacity = '1';
			el.style.color = 'black';
		});
	});

	if (lyrics_container.value) {
		lyrics_container.value.style.opacity = '0';
		setTimeout(() => {
			if (lyrics_container.value) {
				lyrics_container.value.style.opacity = '1';
			}
		}, 1200);
	}
});

watch(lyricsMenuOpen, (value) => {
	setDisableScreensaver(value);
});
</script>

<template>
	<div
		id="lyricsContainer"
		:data-open="lyricsMenuOpen"
		:inert="!lyricsMenuOpen"
		class="absolute inset-0 h-inherit w-inherit sm:left-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-2/3 sm:max-w-3xl tv:max-w-3/4 flex items-center justify-center rounded-xl transition-all duration-500 sm:data-[open='false']:translate-x-[150%] sm:overflow-clip z-[9999] tv:-translate-x-[5%] tv:!w-available tv:data-[open='true']:delay-500 will-change-transform"
	>
		<div
			class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center rounded-xl sm:bg-white/6 dark:sm:bg-black/30 tv:!bg-transparent"
		/>

		<div
			:id="`lyrics_container_${id}`"
			ref="lyrics_container"
			class="relative z-10 flex w-full flex-col overflow-auto scrollbar-none p-4 children:transition-all duration-200 h-available sm:min-h-[calc(100vh-13rem)] gap-4 sm:gap-4 sm:p-16 text-xl sm:text-2xl tv:text-lg tv:p-4 tv:pt-28 tv:gap-3 tv:mt-2"
		>
			<template v-if="!!lyrics">
				<div v-if="Array.isArray(lyrics)" class="contents">
					<template v-for="(lyric, index) in lyrics ?? []" :key="index">
						<LyricItem :lyric="lyric" :index="index" />
					</template>

					<p class="mt-8 sm:mt-16 font-semibold text-2xs">
						{{ $t("Lyrics provided by Musixmatch") }}
					</p>
				</div>
			</template>

			<template v-if="!lyrics">
				<p class="text-lg font-semibold tv:hidden">
					{{ $t("No lyrics available") }}
				</p>
			</template>
		</div>
	</div>
</template>
