<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonSkeletonText } from '@ionic/vue';
import { t } from 'i18next';
import { collect } from 'collect.js';

import type { CollectionResponse } from '@/types/api/base/collection';

import i18next from '@/config/i18next.ts';
import useServerClient from '@/lib/clients/useServerClient';
import { breakTitle2, setTitle } from '@/lib/utils/string';
import { sortByPosterAlphabetized } from '@/lib/utils/array';
import { background, setBackground, setColorPalette, setPoster } from '@/store/ui';
import { currentServer } from '@/store/currentServer';
import router from '@/router';

import InfoItem from '@/views/Base/Info/components/InfoItem.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import HeaderItem from '@/views/Base/Person/components/HeaderItem.vue';
import Collapsible from '@/views/Base/Person/components/Collapsible.vue';
import MobileInfoCard from '@/views/Base/Info/components/MobileInfoCard.vue';
import MediaCard from '@/components/NMCard.vue';
import { convertToHumanReact } from '@/lib/dateTime';

const route = useRoute();

const { data } = useServerClient<CollectionResponse>({
	queryKey: ['base', 'collection', route.params.id],
	limit: 1000,
	keepForever: true,
});

const enabled = ref(false);
const showMore = ref(false);
const trailerIndex = ref(-1);
const endTime = ref<string | 0 | null | undefined>(null);
const interval = ref<NodeJS.Timeout | null>(null);

const content = ref<VueDivElement>();

const backgroundUrl = computed(() => {
	// return `${tmdbImageBaseUrl}/original${background.value}`;
	return `${currentServer.value?.serverBaseUrl}/images/original${
		background.value || data.value?.backdrop
	}`;
});

watch(data, (value) => {
	if (!value)
		return;

	content.value?.$el?.scrollToTop(window.innerHeight);
	enabled.value = true;
	trailerIndex.value = 0;

	setTitle(value?.title);

	if (value?.backdrop) {
		setBackground(value?.backdrop);
	}
	if (value?.poster) {
		setPoster(value?.poster);
	}
	if (value?.color_palette?.poster) {
		setColorPalette(value?.color_palette?.poster);
	}

	endTime.value
		= value.total_duration
			&& new Date(
				new Date().getTime() + value.total_duration * 60 * 1000,
			).toLocaleTimeString(i18next.language ?? 'en-US', {
				hour: '2-digit',
				minute: '2-digit',
			});
	interval.value = setInterval(() => {
		endTime.value
			= value.total_duration
				&& new Date(
					new Date().getTime() + value.total_duration * 60 * 1000,
				).toLocaleTimeString(i18next.language ?? 'en-US', {
					hour: '2-digit',
					minute: '2-digit',
				});
	}, 1000);
});

onMounted(() => {
	content.value?.$el?.scrollToTop(window.innerHeight);
	// trailerIndex.value = 0;
	setTitle(data?.value?.title);

	document.dispatchEvent(new Event('indexer'));

	if (data?.value?.backdrop) {
		setBackground(data?.value?.backdrop);
	}
	if (data?.value?.poster) {
		setPoster(data?.value?.poster);
	}
	if (data?.value?.color_palette?.poster) {
		setColorPalette(data?.value?.color_palette?.poster);
	}
});

onUnmounted(() => {
	setBackground(null);
	setColorPalette(null);
});

onBeforeUnmount(() => {
	content.value?.$el?.scrollToTop(window.innerHeight);
});

router.afterEach(() => {
	setTimeout(() => {
		content.value?.$el?.scrollToTop(window.innerHeight);
	}, 100);
});

const overview = ref<VueDivElement>();

watch(showMore, (value) => {
	if (value) {
		overview.value?.$el?.classList.remove('line-clamp-3');
	}
	else {
		setTimeout(() => {
			overview.value?.$el?.classList.add('line-clamp-3');
		}, 300);
	}
});

const posterStyle
	= 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const yearSpan = computed(() => `${collect(data.value?.collection).min('year')} - ${collect(data.value?.collection).max('year')}`);
</script>

<template>
	<MobileInfoCard :data="data" />

	<div
		class="flex z-0 flex-col justify-start items-center self-stretch h-auto flex-grow gap-4 will-change-auto text-surface-12"
		style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16)"
	>
		<div
			class="flex justify-start items-end flex-grow-0 flex-shrink-0 -mx-4 w-available h-[410px] relative gap-2"
		>
			<div
				class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover bg-top"
				style="
              background: linear-gradient(
                  0deg,
                  rgba(0, 0, 0, 0.3) 0%,
                  rgba(0, 0, 0, 0.3) 100%
                ),
                var(--background-image) lightgray 50% / cover no-repeat;
            "
			/>
		</div>

		<div
			class="flex bg-surface-3 dark:bg-surface-1 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 pt-16 pb-5 will-change-auto w-inherit px-6"
		>
			<p
				v-if="data?.title"
				class="self-stretch flex-grow-0 flex-shrink-0 w-[351px] text-3xl font-bold text-left z-10"
				v-html="breakTitle2(data?.title ?? ' ', 'text-lg line-clamp-2')"
			/>
			<IonSkeletonText
				v-else
				:animated="true"
				class="h-7 will-change-auto"
			/>

			<Collapsible
				v-if="data?.overview"
				:max-lines="3"
				:text="data?.overview"
			/>

			<div
				v-if="data"
				class="flex flex-wrap justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2"
			>
				<HeaderItem v-if="data?.content_ratings" class="children:!border-none children:!bg-transparent" title="Age rating">
					<ContentRating
						v-if="data?.content_ratings"
						:ratings="data?.content_ratings"
						:size="6"
						class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip children:-m-0.5"
					/>
				</HeaderItem>

				<HeaderItem
					v-if="data?.have_items"
					:data="`${data?.have_items}/${data?.number_of_items}`"
					title="Availability"
				/>

				<HeaderItem
					v-if="data?.year"
					:data="data?.year.toString()"
					title="Release date"
				/>

				<HeaderItem v-if="data?.collection" title="Timespan">
					<span class="whitespace-nowrap">
						{{ yearSpan }}
					</span>
				</HeaderItem>

				<HeaderItem
					v-if="data?.total_duration"
					:data="convertToHumanReact(t, data?.total_duration)"
					title="Duration"
				/>
			</div>

			<IonSkeletonText
				v-else
				:animated="true"
				class="h-6 will-change-auto"
			/>
			<div
				class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-surface-7/[0.1] dark:bg-surface-11/[0.1]"
			/>

			<InfoItem
				v-if="data?.genres"
				:data="data"
				key-name="genres"
				prefix="genres"
				title="Genres"
			/>
			<IonSkeletonText
				v-else
				:animated="true"
				class="h-12 will-change-auto"
			/>

			<div
				class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-surface-7/[0.1] dark:bg-surface-11/[0.1]"
			/>

			<div class="flex w-available flex-1 flex-col gap-2">
				<h3
					class="text-2xl font-bold mr-2 "
				>
					{{ $t("Collection") }}
				</h3>
				<div
					:class="posterStyle"
					class="grid w-full gap-4 scroll-smooth music-showing:pb-0"
				>
					<template
						v-for="movie in data?.collection ?? []"
						:key="movie?.id"
					>
						<MediaCard :data="movie" class="" />
					</template>
				</div>
			</div>

			<div
				class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-surface-7/[0.1] dark:bg-surface-11/[0.1]"
			/>

			<PersonCarousel
				v-if="data?.cast && data?.cast?.length > 0"
				:data="data?.cast"
				class="-mx-6"
				title="Cast"
			/>

			<PersonCarousel
				v-if="data?.crew && data?.crew?.length > 0"
				:data="sortByPosterAlphabetized(data?.crew, 'profile', 'id')"
				class="-mx-6"
				title="Crew"
			/>

			<ImageCarousel
				v-if="data?.posters && data?.posters?.length > 0"
				:data="data?.posters"
				class="-mx-6"
				title="Poster"
				type="poster"
			/>

			<ImageCarousel
				v-if="data?.backdrops && data?.backdrops?.length > 0"
				:color-palette="data?.color_palette?.poster"
				:data="data?.backdrops"
				class="-mx-6"
				title="Backdrop"
				type="backdrop"
			/>
		</div>
	</div>
</template>

<style scoped>
:root {
	--background-image: none;
}
</style>
