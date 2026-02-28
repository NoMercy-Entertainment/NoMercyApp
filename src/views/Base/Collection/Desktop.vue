<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { collect } from 'collect.js';

import type { CollectionResponse } from '@/types/api/base/collection';

import i18next from '@/config/i18next';
import useServerClient from '@/lib/clients/useServerClient';
import { setBackground, setColorPalette, setLogo } from '@/store/ui';
import { pickPaletteColor } from '@/lib/colorHelper';
import sidebar from '@/store/sidebar';
import { setTitle, translate } from '@/lib/utils/string';
import { sortByPosterAlphabetized } from '@/lib/utils/array';
import { convertToHumanReact } from '@/lib/dateTime';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import GenrePill from '@/components/Buttons/GenrePill.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import { showBackdrops } from '@/store/preferences';
import MediaCard from '@/components/NMCard.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import { useTranslation } from 'i18next-vue';
import InfoHeaderItem from '@/views/Base/Info/components/InfoHeaderItem.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';
import ShareButton from '@/components/Buttons/ShareButton.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import type { ShareOptions } from '@capacitor/share';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import ListControlHeaderMoreMenu from '@/Layout/Desktop/components/Menus/ListControlHeaderMoreMenu.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import serverClient from '@/lib/clients/serverClient.ts';
import type { IMenuItem } from '@/types';
import { useToast } from 'primevue/usetoast';
import TMDBImage from '@/components/Images/TMDBImage.vue';

const route = useRoute();
const router = useRouter();
const { t } = useTranslation();
const toast = useToast();

/** Change this to slow down or speed up the stagger. Each step = staggerStep ms. */
const staggerStep = 30;
function staggerDelay(index: number): string {
	return `animation-delay: ${index * staggerStep}ms`;
}

const { data, isError } = useServerClient<CollectionResponse>({
	queryKey: ['base', 'collection', route.params.id],
	limit: 1000,
	keepForever: true,
});

const endTime = ref<string | 0 | null | undefined>(null);
const interval = ref<NodeJS.Timeout | null>(null);

watch(data, (value) => {
	if (!value)
		return;

	if (value?.backdrop) {
		setBackground(value?.backdrop);
	}
	if (value?.color_palette) {
		setColorPalette(value.color_palette.backdrop);
	}
	if (value?.logo) {
		setLogo(value?.logo);
	}

	endTime.value
		= value.duration
			&& new Date(
				new Date().getTime() + value.duration * 60 * 1000,
			).toLocaleTimeString(i18next.language ?? 'en-US', {
				hour: '2-digit',
				minute: '2-digit',
			});
	interval.value = setInterval(() => {
		endTime.value
			= value.duration
				&& new Date(
					new Date().getTime() + value.duration * 60 * 1000,
				).toLocaleTimeString(i18next.language ?? 'en-US', {
					hour: '2-digit',
					minute: '2-digit',
				});
	}, 1000);
});

onMounted(() => {
	document.dispatchEvent(new Event('sidebar'));
	setTitle(data?.value?.title);

	if (data?.value?.backdrop) {
		setBackground(data?.value?.backdrop);
	}
	if (data?.value?.color_palette) {
		setColorPalette(data?.value?.color_palette.backdrop);
	}
	if (data?.value?.logo) {
		setLogo(data?.value?.logo);
	}
});

onUnmounted(() => {
	setBackground(null);
	setColorPalette(null);
	setLogo(null);

	clearInterval(interval.value ?? undefined);
});

const shareData = computed<ShareOptions>(() => ({
	url: `https://app.nomercy.tv${route.fullPath}`,
}));

const duration = computed(() => {
	if (!data.value?.total_duration)
		return null;

	return convertToHumanReact(t, data.value.total_duration ?? 0, true);
});

const yearSpan = computed(() => `${collect(data.value?.collection).min('year')} - ${collect(data.value?.collection).max('year')}`);

function toggleWatched() {
}

function handleRescan() {
	serverClient()
		.post<{
		message: string;
		status: string;
		args: string[];
	}>(`${route.fullPath}/rescan`)
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate('Success'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			toast.add({
				severity: 'error',
				summary: translate('error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

function handleRefresh() {
	serverClient()
		.post<{
		message: string;
		status: string;
		args: string[];
	}>(`${route.fullPath}/refresh`)
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

function handleDelete() {
	serverClient()
		.delete<{
		message: string;
		status: string;
		args: string[];
	}>(`${route.fullPath}`)
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			toast.add({
				severity: 'error',
				summary: translate('error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

function handleAdd() {
	serverClient()
		.post<{
		message: string;
		status: string;
		args: string[];
	}>(`${route.fullPath}/add`)
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

const menuItems = computed<IMenuItem[]>(() => [
	{
		icon: 'arrowRefreshHorizontal',
		onclick: handleRescan,
		title: 'Rescan files',
		privileged: true,
	},
	{
		icon: 'arrowRefreshHorizontal',
		onclick: handleRefresh,
		title: 'Refresh data',
		privileged: true,
	},
	{
		icon: 'folderAdd',
		onclick: handleAdd,
		title: `Add ${data?.value?.media_type}`,
		privileged: true,
	},
	{
		icon: 'folderRemove',
		onclick: handleDelete,
		title: `Delete ${data?.value?.media_type}`,
		privileged: true,
	},
	{
		icon: 'edit',
		onclick: () => {
			router.push(`/dashboard/specials/${data?.value?.id}`);
		},
		title: 'Edit metadata',
	},
]);
</script>

<template>
	<NotFound v-if="isError && !data" />
	<ScrollContainer v-else :auto-hide="true" :static="true">
		<div class="z-0 flex flex-col gap-4 rounded-3xl border-0 w-available scrollbar-none border-surface-3 text-surface-12/70 dark:text-surface-12/80">
			<div class="flex flex-col gap-4 overflow-clip rounded-3xl border-0 pb-2 w-available scrollbar-none border-surface-3">
				<FloatingBackButton />

				<div
					v-if="data"
					class="flex flex-col relative mx-auto w-full gap-4 rounded-lg p-4 max-w-screen-4xl justify-end min-h-[calc(100vh-6rem)] z-10"
				>
					<div class="z-0 flex w-full flex-grow flex-col min-h-40" />
					<div class="z-0 flex w-full flex-grow flex-col items-end justify-end gap-2">
						<!-- Logo -->
						<div
							:style="staggerDelay(0)"
							class="children:absolute relative right-1 bottom-0 col-start-1 col-end-2 flex h-auto w-auto select-none justify-end pb-2 max-w-[20vw] w-available translate-x-[4px] sm:h-40 lg:max-w-[30vw] aspect-[32/9] fade-up"
						>
							<TMDBImage
								v-if="data?.logo"
								:key="data?.logo"
								:auto-shadow="true"
								:path="data?.logo"
								:right="true"
								:shadow="pickPaletteColor(data?.color_palette?.poster)"
								:size="500"
								:title="data?.title"
								class="pointer-events-none relative mx-auto flex h-full w-full select-none place-self-start overflow-hidden p-4 items-end justify-end"
								class-name="relative bottom-0 h-auto w-auto p-4"
								type="logo"
							/>
						</div>

						<!-- Info card -->
						<div
							:style="staggerDelay(2)"
							class="relative grid flex-shrink-0 flex-grow-0 grid-cols-3 items-start justify-start self-stretch rounded-2xl bg-gradient-to-b p-6 from-surface-1/12 via-surface-2/12 to-surface-2/11 border-surface-5/8 border-1 min-h-[23.5rem] fade-up"
						>
							<!-- Floating poster -->
							<div
								v-if="data?.poster"
								:style="staggerDelay(11)"
								class="absolute z-10 col-start-1 col-end-2 h-auto w-full items-start justify-start rounded-lg top-0 -translate-y-[35%] sm:block fade-up"
							>
								<RouterLink
									:aria-label="$t('Play')"
									:class="{
										' 4xl:-mt-10 5xl:-mt-20 6xl:-mt-28 mb-20 6xl:mb-28': sidebar === 'open',
										' 4xl:-mt-2 5xl:-mt-60 6xl:-mt-28 mb-60 6xl:mb-28': sidebar !== 'open',
									}"
									:to="`${data?.link}/watch`"
									class="relative h-available m-auto mx-auto flex-1 flex max-w-[75%] scale-95 cursor-default group/card z-0 transitioning rounded-2xl aspect-poster overflow-clip select-none cover !shadow-none max-h-available"
									data-nav="true"
									data-nav-r="play"
									data-nav-reset="true"
								>
									<TMDBImage
										:key="data?.poster || 'poster'"
										:auto-shadow="true"
										:color-palette="data?.color_palette?.poster"
										:path="data?.poster"
										:size="760"
										:title="data?.title"
										aspect="poster"
										class="m-auto scale-100 rounded-2xl"
										class-name="pointer-events-none absolute z-20 flex scale-100 select-none items-center place-self-start overflow-hidden rounded-2xl"
										priority="high"
										type="image"
									/>

									<span class="tv:group-focus-visible/card:bg-black/3 absolute z-20 grid h-available w-full items-center transition-transform duration-200 opacity-0 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] mx-auto group-hover/card:opacity-100">
										<span
											class="inset-0 grid group-hover/card:grid h-full w-full place-content-center group-focus-visible/card:bg-none group-hover/card:bg-none text-5xl text-transparent transition-transform duration-200 group-focus-visible/card:transitioning group-hover/card:text-surface-12"
										>
											<MoooomIcon
												class-name="w-20 text-surface-12/70 dark:text-surface-12/80"
												icon="play"
											/>
										</span>
									</span>
								</RouterLink>
							</div>

							<p class="col-start-1 content-center col-end-2 mt-auto bottom-6 left-8 w-full flex-shrink-0 select-none flex-grow-0 text-sm text-surface-12/70 dark:text-surface-12/80">
								{{ $t("Data provided by The Movie Database(TMDb)") }}.
							</p>

							<!-- Info column -->
							<div class="col-start-2 col-end-4 flex w-full flex-grow flex-col items-start justify-start gap-4">
								<!-- Title + action buttons -->
								<div class="relative flex flex-shrink-0 flex-grow-0 items-end justify-end gap-4 self-stretch">
									<p
										class="flex-grow text-5xl font-bold fade-up"
										style="animation-delay: 600ms; font-size: clamp(1.25rem, 2.309vw + 0.652rem, 2rem); line-height: clamp(1.875rem, 2.54vw + 1.218rem, 2.75rem);"
									>
										{{ data?.title?.replace(/(: | en de )/, "\n") }}
									</p>

									<div class="relative flex flex-shrink-0 flex-grow-0 items-end justify-end gap-4">
										<BannerButton
											:href="`${data?.link}/watch`"
											:style="staggerDelay(13)"
											:title="endTime ? `${$t('Ends at')} ${endTime}` : $t('Play')"
											class="bg-surface-6 fade-up"
										>
											<MoooomIcon
												class-name="w-6 text-surface-12/70 dark:text-surface-12/80"
												icon="play"
											/>
										</BannerButton>

										<BannerButton
											:style="staggerDelay(14)"
											class="bg-surface-6 fade-up"
											title="Mark as watched"
											@click="toggleWatched"
										>
											<MoooomIcon
												class-name="w-6 text-surface-12/70 dark:text-surface-12/80"
												icon="check"
											/>
										</BannerButton>

										<ShareButton
											:share-data="shareData"
											:style="staggerDelay(15)"
											class="!p-0 fade-up"
										/>

										<MediaLikeButton
											v-if="data"
											:data="data"
											:style="staggerDelay(16)"
											class="fade-up"
											type="video"
										/>

										<ListControlHeaderMoreMenu
											:items="menuItems"
											:style="staggerDelay(17)"
											class="text-surface-12/70 dark:text-surface-12/80 fade-up"
										/>
									</div>
								</div>

								<!-- Meta pills -->
								<div class="flex flex-shrink-0 items-center justify-start gap-4 self-stretch">
									<InfoHeaderItem
										v-if="yearSpan"
										:style="staggerDelay(19)"
										class="fade-up"
									>
										<p class="flex-shrink-0 text-sm font-bold uppercase">
											{{ yearSpan }}
										</p>
									</InfoHeaderItem>

									<InfoHeaderItem
										:style="staggerDelay(20)"
										class="fade-up"
									>
										<p class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase">
											{{ data?.have_items }} / {{ data?.number_of_items }}
										</p>
									</InfoHeaderItem>

									<InfoHeaderItem
										v-if="duration"
										:style="staggerDelay(21)"
										class="fade-up"
									>
										<p class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase">
											{{ duration }}
										</p>
									</InfoHeaderItem>

									<div
										v-if="data?.content_ratings?.length"
										:style="staggerDelay(22)"
										class="relative overflow-hidden fade-up"
									>
										<ContentRating
											:ratings="data.content_ratings"
											:size="6"
											class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip"
										/>
									</div>
								</div>

								<!-- Overview and details -->
								<div class="relative flex flex-col items-start justify-start gap-2 self-stretch">
									<div
										:style="staggerDelay(23)"
										class="h-px bg-surface-1/10 fade-up"
									/>
									<div
										v-if="data?.overview"
										:style="staggerDelay(24)"
										class="w-full text-lg font-medium mb-4 fade-up"
									>
										{{ data?.overview }}
									</div>

									<!-- Genres -->
									<div
										v-if="data?.genres?.length"
										:style="staggerDelay(25)"
										class="flex flex-wrap gap-1.5 fade-up"
									>
										<GenrePill
											v-for="genre in data?.genres"
											:key="genre.id"
											:genre="genre"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Media Grid -->
				<section
					v-if="data"
					:class="showBackdrops ? 'media-backdrop-grid' : 'media-poster-grid'"
					class="items-start justify-start gap-4 self-stretch px-4"
				>
					<MediaCard
						v-for="movie in data?.collection ?? []"
						:key="movie?.id"
						:data="movie"
					/>
				</section>

				<!-- Carousels -->
				<PersonCarousel
					v-if="data?.cast && data?.cast?.length > 0"
					id="cast"
					:data="sortByPosterAlphabetized(data?.cast, 'order', 'id').slice(0, 50)"
					:index="0"
					next_id="crew"
					previous_id="poster"
					title="Cast"
				/>

				<PersonCarousel
					v-if="data?.crew && data?.crew?.length > 0"
					id="crew"
					:data="sortByPosterAlphabetized(data?.crew).slice(0, 50)"
					:index="0"
					next_id="backdrop"
					previous_id="cast"
					title="Crew"
				/>

				<ImageCarousel
					v-if="data?.posters && data?.posters?.length > 0"
					id="poster"
					:data="data?.posters"
					:index="0"
					next_id="backdrop"
					previous_id="crew"
					title="Poster"
					type="poster"
				/>

				<ImageCarousel
					v-if="data?.backdrops && data?.backdrops?.length > 0"
					id="backdrop"
					:color-palette="data?.color_palette?.poster"
					:data="data?.backdrops"
					:index="0"
					next_id=""
					previous_id="backdrop"
					title="Backdrop"
					type="backdrop"
				/>
			</div>
		</div>
	</ScrollContainer>
</template>

<style scoped>
ion-content::part(background) {
	background: rgb(0 0 0 / 60%);
}

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
