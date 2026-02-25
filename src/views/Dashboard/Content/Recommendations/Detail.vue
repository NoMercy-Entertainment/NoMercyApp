<script lang="ts" setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { RecommendationDetailResponse } from '@/types/api/dashboard/recommendation';

import useServerClient from '@/lib/clients/useServerClient';
import { background, setBackground, setColorPalette, setLogo, setTitle } from '@/store/ui';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import InfoHeaderItem from '@/views/Base/Info/components/InfoHeaderItem.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import GenrePill from '@/components/Buttons/GenrePill.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();

const { data: recommendation, error } = useServerClient<RecommendationDetailResponse>({
	path: `dashboard/recommendations/${route.params.type}/${route.params.id}`,
	queryKey: ['dashboard', 'recommendation', route.params.type as string, route.params.id as string],
});

watch(recommendation, (value) => {
	if (value?.title) {
		setTitle(value.title);
	}
	if (value?.backdrop && background.value !== value?.backdrop) {
		setBackground(value?.backdrop);
	}
	if (value?.logo) {
		setLogo(value?.logo);
	}
	if (value?.color_palette?.backdrop || value?.color_palette?.poster) {
		setColorPalette(value?.color_palette?.poster || value?.color_palette?.backdrop);
	}
});

const staggerStep = 30;
function staggerDelay(index: number): string {
	return `animation-delay: ${index * staggerStep}ms`;
}

onMounted(() => {
	setTitle(recommendation?.value?.title);

	if (recommendation?.value?.backdrop && background.value !== recommendation?.value?.backdrop) {
		setBackground(recommendation?.value?.backdrop);
	}
	if (recommendation?.value?.logo) {
		setLogo(recommendation?.value?.logo);
	}
	if (
		recommendation?.value?.color_palette?.backdrop
		|| recommendation?.value?.color_palette?.poster
	) {
		setColorPalette(recommendation?.value?.color_palette?.poster ?? recommendation?.value?.color_palette?.backdrop);
	}
});

onUnmounted(() => {
	setBackground(null);
	setColorPalette(null);
	setLogo(null);
});
</script>

<template>
	<DashboardLayout
		:error="error"
		:grid-style="0"
		:params="{ title: recommendation?.title }"
		back
		class-name="!px-0"
		title="Recommendation: {{title}}"
	>
		<template #cta />

		<div v-if="recommendation" class="flex w-full flex-col gap-8">
			<!-- Main info card -->
			<div
				:style="staggerDelay(0)"
				class="grid grid-cols-1 items-start gap-6 rounded-2xl border-1 border-surface-5/8 bg-gradient-to-b from-surface-1/12 via-surface-2/12 to-surface-2/11 p-6 lg:grid-cols-[16rem_1fr] fade-up mx-4"
			>
				<!-- Poster -->
				<div
					:style="staggerDelay(1)"
					class="mx-auto w-48 flex-shrink-0 overflow-clip rounded-lg lg:mx-0 lg:w-64 aspect-poster fade-up relative group/card z-0"
				>
					<RouterLink v-if="recommendation.poster"
						:aria-label="$t('Details')"
						:to="`${recommendation?.link}`"
						class=""
						data-nav="true"
						data-nav-r="play"
						data-nav-reset="true"
					>
						<TMDBImage
							:color-palette="recommendation.color_palette?.poster"
							:path="recommendation.poster"
							:size="400"
							:title="recommendation.title"
							aspect="poster"
							class="h-full w-full"
							class-name="h-full w-full object-cover"
							priority="high"
						/>

						<span class="tv:group-focus-visible/card:bg-black/3 absolute -inset-1 z-20 grid h-available w-full items-center transition-transform duration-200 opacity-0 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] mx-auto group-hover/card:opacity-100">
							<span
								class="inset-0 grid group-hover/card:grid h-full w-full place-content-center group-focus-visible/card:bg-none group-hover/card:bg-none text-5xl text-transparent transition-transform duration-200 group-focus-visible/card:transitioning group-hover/card:text-surface-12"
							>
								<MoooomIcon class-name="w-20 text-surface-12/70 dark:text-surface-12/80"
									icon="link1"
								/>
							</span>
						</span>
					</RouterLink>
					<div v-else class="grid h-full w-full place-items-center bg-surface-3">
						<span class="text-xl font-bold text-surface-12/50">
							{{ recommendation.title }}
						</span>
					</div>
				</div>

				<!-- Info column -->
				<div class="flex flex-col gap-4">
					<!-- Title -->
					<p
						:style="staggerDelay(2)"
						class="text-3xl font-bold text-surface-12 fade-up"
						style="font-size: clamp(1.25rem, 2.309vw + 0.652rem, 2rem); line-height: clamp(1.875rem, 2.54vw + 1.218rem, 2.75rem);"
					>
						{{ recommendation.title }}
					</p>

					<!-- Meta pills -->
					<div
						v-if="recommendation.year || recommendation.voteAverage || recommendation.content_ratings?.length"
						:style="staggerDelay(3)"
						class="flex flex-wrap items-center gap-3 fade-up"
					>
						<InfoHeaderItem>
							<p class="flex-shrink-0 text-sm font-bold">
								{{ recommendation.media_type === 'tv' ? 'TV Show' : 'Movie' }}
							</p>
						</InfoHeaderItem>

						<InfoHeaderItem v-if="recommendation.year">
							<p class="flex-shrink-0 text-sm font-bold uppercase">
								{{ recommendation.year }}
							</p>
						</InfoHeaderItem>

						<InfoHeaderItem v-if="recommendation.voteAverage">
							<p class="flex-shrink-0 text-sm font-bold">
								&#11088; {{ recommendation.voteAverage?.toFixed(1) }}/10
							</p>
						</InfoHeaderItem>

						<ContentRating
							v-if="recommendation.content_ratings?.length"
							:ratings="recommendation.content_ratings"
							:size="4"
						/>
					</div>

					<!-- Overview -->
					<p
						v-if="recommendation.overview"
						:style="staggerDelay(4)"
						class="text-base font-medium text-surface-12/70 dark:text-surface-12/80 fade-up"
					>
						{{ recommendation.overview }}
					</p>

					<!-- Genres -->
					<div
						v-if="recommendation.genres?.length"
						:style="staggerDelay(5)"
						class="flex flex-wrap gap-1.5 fade-up"
					>
						<GenrePill
							v-for="genre in recommendation.genres"
							:key="genre.id"
							:genre="genre"
						/>
					</div>

					<!-- Media type & external links -->
					<div :style="staggerDelay(36)"
						class="relative grid w-full flex-shrink-0 flex-grow-0 grid-cols-7 items-start justify-start gap-1 fade-up"
					>
						<p class="grid-cols-3 text-xs font-bold uppercase text-surface-12/70 dark:text-surface-12/80">
							{{ $t("External links") }}
						</p>
						<div
							class="col-span-6 col-start-3 flex w-full max-w-fit flex-wrap gap-1 self-center xl:col-start-3 2xl:col-start-2 text-surface-12 dark:text-surface-12/80 font-semibold"
						>
							<div class="gap-1 children:whitespace-nowrap text-sm">
								<a :href="`https://themoviedb.org/${recommendation?.media_type}/${recommendation?.id}`"
									class="text-surface-12/60 underline-offset-4 hover:text-surface-12 hover:underline"
									target="_blank"
								>
									TheMovieDb
								</a>
								<span>{{
									recommendation?.external_ids?.imdb_id
										? ","
										: ""
								}}</span>
							</div>
							<div class="gap-1 children:whitespace-nowrap text-sm">
								<a
									v-if="recommendation.external_ids?.imdb_id"
									:href="`https://imdb.com/title/${recommendation.external_ids.imdb_id}`"
									class="text-surface-12/60 underline-offset-4 hover:text-surface-12 hover:underline"
									target="_blank"
								>
									IMDb
								</a>

								<span>{{
									recommendation?.external_ids?.tvdb_id
										? ","
										: ""
								}}</span>
							</div>
							<div v-if="recommendation?.external_ids?.tvdb_id"
								class="gap-1 children:whitespace-nowrap text-sm"
							>
								<a :href="`https://thetvdb.com/?tab=series&id=${recommendation?.external_ids?.tvdb_id}&lid=eng`"
									class="text-surface-12/60 underline-offset-4 hover:text-surface-12 hover:underline"
									target="_blank"
								>
									TheTvDb
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- "Because you have" section -->
			<MediaCarousel
				v-if="recommendation.because_you_have?.length"
				:data="recommendation.because_you_have"
				:style="staggerDelay(7)"
				class="fade-up"
				title="Because you have"
				type="poster"
			/>
		</div>
	</DashboardLayout>
</template>

<style scoped>
@keyframes fadeSlideUp {
	from {
		opacity: 0;
		translate: 0 0.75rem;
	}
	to {
		opacity: 1;
		translate: 0 0;
	}
}

.fade-up {
	animation: fadeSlideUp 0.45s ease both;
}
</style>
