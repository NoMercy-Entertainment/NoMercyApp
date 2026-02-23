<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import { MenuItem } from '@headlessui/vue';
import type { ShareOptions } from '@capacitor/share';

import type { InfoResponse } from '@/types/api/base/info';
import type { MoooomIcons } from '@Icons/icons';

import { buttonClasses, isNative } from '@/config/global';
import i18next from '@/config/i18next';

import useServerClient from '@/lib/clients/useServerClient';
import { setTitle, translate } from '@/lib/utils/string';
import { sortByPosterAlphabetized } from '@/lib/utils/array';
import { pickPaletteColor } from '@/lib/colorHelper';
import serverClient from '@/lib/clients/serverClient';
import { useTrailerService } from '@/composables/useTrailerService';
import { background, setBackground, setColorPalette, setLogo } from '@/store/ui';
import { currentSong } from '@/store/audioPlayer';

import ListControlHeaderMoreMenu from '@/Layout/Desktop/components/Menus/ListControlHeaderMoreMenu.vue';

import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import SeasonCarousel from '@/components/Carousel/SeasonCarousel.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import InfoHeaderItem from '@/views/Base/Info/components/InfoHeaderItem.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import InfoItem from '@/views/Base/Info/components/InfoItem.vue';
import Trailer from '@/views/Base/Info/components/Trailer.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import ShareButton from '@/components/Buttons/ShareButton.vue';

import MissingEpisodes from '@/views/Base/Info/components/MissingEpisodes.vue';
import { useToast } from 'primevue/usetoast';
import sidebar from '@/store/sidebar.ts';
import { convertToHumanReact } from '@/lib/dateTime.ts';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { twMerge } from 'tailwind-merge';

const route = useRoute();
const { t } = useTranslation();
const toast = useToast();

const { data, isError, error } = useServerClient<InfoResponse>({
	keepForever: true,
	queryKey: ['base', 'info', route.params.id],
	path: route?.fullPath,
});

const { data: hasItem } = useServerClient<{
	available: boolean;
	server: string;
}>({
	queryKey: ['base', 'info', route.params.id, 'available'],
	path: `${route.fullPath}/available`,
});

const { buttonState, trailerOpen, resolvedTrailer, toggleTrailer } = useTrailerService(data);
const missingEpisodesModalOpen = ref(false);

interface IMenuItem {
	icon: keyof typeof MoooomIcons;
	onclick: () => void;
	title: string;
	privileged?: boolean;
}

const shareData = computed<ShareOptions>(() => ({
	url: `https://app.nomercy.tv${route.fullPath}`,
}));

const duration = computed(() => convertToHumanReact(t, data.value?.duration ?? 0, true));

const endTime = computed(() => {
	if (!data?.value?.duration || !i18next?.language || i18next.language === 'undefined')
		return null;
	return new Date(new Date().getTime() + data.value.duration * 60 * 1000)
		.toLocaleTimeString(i18next?.language ?? 'en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
});

const endString = computed(() => {
	if (!data?.value?.duration)
		return t('Play');

	if (endTime.value)
		return t('Ends at {{time}}', { time: endTime.value });

	return t('Play');
});

function openMissingEpisodesContentModal() {
	missingEpisodesModalOpen.value = true;
}

function closeMissingEpisodesModal() {
	missingEpisodesModalOpen.value = false;
}

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
		title: `Add ${data?.value?.media_type === 'movie' ? 'movie' : 'TV show'}`,
		privileged: true,
	},
	{
		icon: 'folderRemove',
		onclick: handleDelete,
		title: `Delete ${data?.value?.media_type === 'movie' ? 'movie' : 'TV show'}`,
		privileged: true,
	},
	{
		icon: 'searchMagnifyingGlass',
		onclick: openMissingEpisodesContentModal,
		title: 'Show missing episodes',
		privileged: true,
	},
	{
		icon: 'edit',
		onclick: () => {
			window.open(`https://www.themoviedb.org/${data?.value?.media_type}/${data?.value?.id}/edit`, '_blank');
		},
		title: 'Edit on TMDb',
	},
]);

onMounted(() => {
	setTitle(data?.value?.name);

	if (data?.value?.backdrop && background.value !== data?.value?.backdrop) {
		setBackground(data?.value?.backdrop);
	}
	if (data?.value?.logo) {
		setLogo(data?.value?.logo);
	}
	if (
		data?.value?.color_palette?.backdrop
		|| data?.value?.color_palette?.poster
	) {
		setColorPalette(data?.value?.color_palette?.poster ?? data?.value?.color_palette?.backdrop);
	}
});

watch(data, (value) => {
	setTitle(value?.title ?? value?.name);
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
</script>

<template>
	<NotFound v-if="isError && !data" />
	<ScrollContainer v-else :auto-hide="true" :static="true">
		<div
			:class="{
				'pb-2': isNative && currentSong,
			}"
			class="z-0 flex flex-col gap-4 rounded-3xl border-0 w-available scrollbar-none border-surface-3 text-surface-12/70  dark:text-surface-12/80"
		>
			<div v-if="isError || error" class="">
				<p>{{ error }}</p>
			</div>
			<div
				class="flex flex-col gap-4 overflow-clip rounded-3xl border-0 pb-2 w-available scrollbar-none border-surface-3"
			>
				<FloatingBackButton />

				<div
					class="flex flex-col relative mx-auto w-full gap-4 rounded-lg p-4 max-w-screen-4xl justify-end min-h-[calc(100vh-6rem)] z-10"
				>
					<div class="z-0 flex w-full flex-grow flex-col min-h-40" />
					<div
						class="z-0 flex w-full flex-grow flex-col items-end justify-end gap-2"
					>
						<div
							class="children:absolute relative right-1 bottom-0 col-start-1 col-end-2 flex h-auto w-auto select-none justify-end pb-2 max-w-[20vw] w-available translate-x-[4px] sm:h-40 lg:max-w-[30vw] aspect-[32/9] fade-up"
							style="animation-delay: 0ms"
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

						<div
							class="relative col-start-2 col-end-4 grid flex-shrink-0 flex-grow-0 grid-cols-3 items-start justify-start self-stretch rounded-2xl bg-gradient-to-b p-6 from-surface-1/12 via-surface-2/12 to-surface-2/11 border-surface-5/8 border-1 min-h-[23.5rem] fade-up"
							style="animation-delay: 150ms"
						>
							<div
								v-if="data?.poster"
								:class="{
									'': hasItem,
								}"
								class="absolute z-10 col-start-1 content-center col-end-2 h-auto w-full items-start justify-start rounded-lg top-0 -translate-y-[35%] sm:block fade-up"
								style="animation-delay: 650ms"
							>
								<RouterLink
									:aria-label="$t('Play')"
									:class="{
										' 4xl:-mt-10 5xl:-mt-20 6xl:-mt-28 mb-20 6xl:mb-28': sidebar === 'open',
										' 4xl:-mt-2 5xl:-mt-60 6xl:-mt-28 mb-60 6xl:mb-28': sidebar !== 'open',
										'hover:!scale-100 hover:-translate-y-1': hasItem,
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
										class-name="pointer-events-none absolute -inset-1 z-20 flex scale-100 select-none items-center place-self-start overflow-hidden rounded-2xl"
										priority="high"
										type="image"
									/>

									<span
										:class="`tv:group-focus-visible/card:bg-black/3 absolute -inset-1 z-20 grid h-available w-full items-center transition-transform duration-200 opacity-0 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] mx-auto ${
											hasItem ? 'group-hover/card:opacity-100' : ''
										}`"
									>
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

							<p
								class="col-start-1 content-center col-end-2 mt-auto bottom-6 left-8 w-full flex-shrink-0 select-none flex-grow-0 text-sm text-surface-12/70 dark:text-surface-12/80"
							>
								{{ $t("Data provided by The Movie Database(TMDb)") }}.
							</p>

							<div
								class="col-start-2 col-end-4 flex w-full flex-grow flex-col items-start justify-start gap-4"
							>
								<div
									class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4 self-stretch"
								>
									<p
										class="flex-grow text-5xl font-bold w-[806px] fade-up"
										style="
                          animation-delay: 650ms;
                          font-size: clamp(1.25rem, 2.309vw + 0.652rem, 2rem);
                          line-height: clamp(
                            1.875rem,
                            2.54vw + 1.218rem,
                            2.75rem
                          );
                        "
									>
										{{ data?.title?.replace(/(: | en de )/, "\n") }}
									</p>

									<div
										v-if="data"
										class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4"
									>
										<BannerButton
											v-if="hasItem"
											:href="`${data?.link}/watch`"
											:show-delay="0"
											:title="endString"
											class="bg-surface-6 fade-up"
											style="animation-delay: 700ms"
										>
											<MoooomIcon
												class-name="w-6 text-surface-12/70  dark:text-surface-12/80"
												icon="play"
											/>
										</BannerButton>

										<ListControlHeaderMoreMenu
											v-else-if="data && data.watch_providers && data.watch_providers.length > 0"
											:items="[]"
											class="text-surface-12/70 dark:text-surface-12/80 fade-up"
											style="animation-delay: 700ms"
											class-name="max-h-80 overflow-y-auto overflow-x-hidden !ml-0 !-translate-x-1/3"
										>
											<template #button>
												<span
													class="whitespace-nowrap text-base font-semibold"
												>
													{{ $t("Watch options") }}
												</span>

												<MoooomIcon
													class-name="w-6"
													icon="chevronDown"
												/>
											</template>
											<template
												v-for="provider in data.watch_providers.toSorted((a, b) => b.display_priority - a.display_priority)"
												:key="provider.id"
											>
												<MenuItem
													:class="twMerge(buttonClasses, 'w-fit min-w-60 !flex h-12 pl-1.5 sm:bg-surface-transparent')"
													:href="provider.link"
													as="a"
													target="_blank"
												>
													<img v-if="provider?.logo"
														:alt="provider?.name"
														:src="`https://image.tmdb.org/t/p/w92${provider?.logo}`"
														class="inline h-10 w-10 rounded-sm align-middle col-span-1"
													>
													<span class="w-full whitespace-nowrap col-span-4 text-base font-semibold">
														{{ provider?.name }}
													</span>
												</MenuItem>
											</template>
										</ListControlHeaderMoreMenu>

										<BannerButton
											v-else
											no-tip
											title="Not available"
											class="fade-up"
											style="animation-delay: 700ms"
										>
											<span
												class="whitespace-nowrap text-base font-semibold ml-1"
											>
												{{ $t("Not available") }}
											</span>
											<MoooomIcon
												class-name="w-6"
												icon="playUnavailable"
											/>
										</BannerButton>

										<BannerButton
											class="bg-surface-6 fade-up"
											style="animation-delay: 750ms"
											title="Watch trailer"
											@click="buttonState === 'available' ? toggleTrailer($event) : null"
										>
											<MoooomIcon
												:style="`color: ${
													buttonState === 'available'
														? 'var(--color-green-8)'
														: buttonState === 'unavailable'
															? 'var(--color-red-8)'
															: 'var(--color-gray-8)'
												}`"
												class-name="w-6"
												icon="film"
											/>
										</BannerButton>

										<BannerButton
											class="bg-surface-6 fade-up"
											style="animation-delay: 800ms"
											title="Mark as watched"
											@click="toggleWatched"
										>
											<MoooomIcon
												class-name="w-6 text-surface-12/70  dark:text-surface-12/80"
												icon="check"
											/>
										</BannerButton>

										<ShareButton
											:share-data="shareData"
											class="!p-0 fade-up"
											style="animation-delay: 850ms"
										/>

										<MediaLikeButton v-if="data" :data="data" type="video" class="fade-up" style="animation-delay: 900ms" />

										<ListControlHeaderMoreMenu
											:items="menuItems"
											class="text-surface-12/70 dark:text-surface-12/80 fade-up"
											style="animation-delay: 950ms"
										/>
									</div>
								</div>

								<div
									v-if="data"
									class="flex flex-shrink-0 items-center justify-start gap-4 self-stretch"
								>
									<InfoHeaderItem v-if="data?.year" class="fade-up" style="animation-delay: 1000ms">
										<p
											class="flex-shrink-0 text-sm font-bold uppercase"
										>
											{{ data?.year }}
										</p>
									</InfoHeaderItem>
									<InfoHeaderItem v-if="data?.number_of_items" class="fade-up" style="animation-delay: 1050ms">
										<p
											class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase"
										>
											{{ data?.number_of_items }} {{ $t("ep") }}.
										</p>
									</InfoHeaderItem>
									<InfoHeaderItem v-if="data?.duration" class="fade-up" style="animation-delay: 1100ms">
										<p
											class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase"
										>
											{{ duration }}
										</p>
									</InfoHeaderItem>
									<InfoHeaderItem v-if="data?.voteAverage" class="fade-up" style="animation-delay: 1150ms">
										<p
											class="flex-shrink-0 flex-grow-0 text-sm font-bold -ml-0.5"
										>
											⭐ ️{{ data?.voteAverage?.toFixed(0) }}/10
										</p>
									</InfoHeaderItem>
									<div
										v-if="data?.content_ratings"
										class="relative overflow-hidden fade-up"
										style="animation-delay: 1200ms"
									>
										<ContentRating
											:ratings="data?.content_ratings"
											:size="6"
											class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip"
										/>
									</div>
								</div>

								<div
									v-if="data"
									class="relative flex flex-col items-start justify-start gap-2 self-stretch"
								>
									<div class="h-px bg-surface-1/10 fade-up" style="animation-delay: 1250ms" />
									<div class="w-full text-lg font-medium mb-4 fade-up" style="animation-delay: 1300ms">
										<div v-if="!data?.overview" class="">
											<span class="">
												{{ $t("We don't have an overview for ") }}
												{{ data.name }}.
												{{ $t("Feel free to contribute!") }}
											</span>
											<a
												:href="`https://www.themoviedb.org/${route.params?.type}/${route.params?.id}/edit`"
												class="underline underline-offset-4"
											>
												{{ $t("Contribute to TMDb") }}
											</a>
										</div>
										{{ data?.overview }}
									</div>

									<InfoItem
										v-if="data?.genres"
										:data="data"
										key-name="genres"
										prefix="genres"
										title="Genres"
										class="fade-up"
										style="animation-delay: 1350ms"
									/>
									<InfoItem
										v-if="data?.writer"
										:data="{ writer: [data?.writer] }"
										key-name="writer"
										prefix="person"
										title="Writer"
										class="fade-up"
										style="animation-delay: 1400ms"
									/>
									<InfoItem
										v-if="data?.creator"
										:data="{ creator: [data?.creator] }"
										key-name="creator"
										prefix="person"
										title="Creator"
										class="fade-up"
										style="animation-delay: 1450ms"
									/>
									<InfoItem
										v-if="data?.director"
										:data="{ director: [data?.director] }"
										key-name="director"
										prefix="person"
										title="Director"
										class="fade-up"
										style="animation-delay: 1500ms"
									/>
									<InfoItem
										v-if="data?.creators?.length > 0"
										:data="data"
										key-name="creators"
										prefix="person"
										title="Creators"
										class="fade-up"
										style="animation-delay: 1550ms"
									/>
									<InfoItem
										v-if="data?.directors?.length > 0"
										:data="data"
										key-name="directors"
										prefix="person"
										title="Directors"
										class="fade-up"
										style="animation-delay: 1600ms"
									/>
									<InfoItem
										v-if="data?.writers?.length > 0"
										:data="data"
										key-name="writers"
										prefix="person"
										title="Writers"
										class="fade-up"
										style="animation-delay: 1650ms"
									/>
									<InfoItem
										v-if="data?.keywords?.length > 0"
										:data="data"
										key-name="keywords"
										title="Keywords"
										class="fade-up"
										style="animation-delay: 1700ms"
									/>
									<InfoItem
										v-if="data?.networks?.length > 0"
										:data="data"
										key-name="networks"
										title="Networks"
										class="fade-up"
										style="animation-delay: 1750ms"
									/>
									<InfoItem
										v-if="data?.companies?.length > 0"
										:data="data"
										key-name="companies"
										title="Companies"
										class="fade-up"
										style="animation-delay: 1800ms"
									/>

									<div
										class="relative grid w-full flex-shrink-0 flex-grow-0 grid-cols-7 items-start justify-start gap-1 fade-up"
										style="animation-delay: 1850ms"
									>
										<p class="grid-cols-3 text-xs font-bold uppercase text-surface-12/70 dark:text-surface-12/80">
											{{ $t("External links") }}
										</p>
										<div
											class="col-span-6 col-start-3 flex w-full max-w-fit flex-wrap gap-1 self-center xl:col-start-3 2xl:col-start-2 text-surface-12 dark:text-surface-12/80 font-semibold"
										>
											<div class="gap-1 children:whitespace-nowrap text-sm">
												<a
													:href="`https://themoviedb.org/${data?.media_type}/${data?.id}`"
													class="inline-block underline-offset-4 hover:underline focus-visible:underline"
													target="_blank"
												>
													TheMovieDb
												</a>
												<span>{{
													data?.external_ids?.imdb_id
														|| data?.external_ids?.tvdb_id
														? ","
														: ""
												}}</span>
											</div>

											<div
												v-if="data?.external_ids?.imdb_id"
												class="gap-1 children:whitespace-nowrap text-sm"
											>
												<a
													:href="`https://imdb.com/title/${data?.external_ids?.imdb_id}`"
													class="inline-block underline-offset-4 hover:underline focus-visible:underline"
													target="_blank"
												>
													IMDb
												</a>
												<span>{{
													data?.external_ids?.tvdb_id ? "," : ""
												}}</span>
											</div>

											<div
												v-if="data?.external_ids?.tvdb_id"
												class="gap-1 children:whitespace-nowrap text-sm"
											>
												<a
													:href="`https://thetvdb.com/?tab=series&id=${data?.external_ids?.tvdb_id}&lid=eng`"
													class="inline-block underline-offset-4 hover:underline focus-visible:underline"
													target="_blank"
												>
													TheTvDb
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<SeasonCarousel
					v-if="data?.seasons && data?.seasons?.length > 0"
					:data="data?.seasons"
					type="backdrop"
				/>

				<PersonCarousel
					v-if="data?.cast && data?.cast?.length > 0"
					:data="data?.cast.slice(0, 50)"
					title="Cast"
				/>

				<PersonCarousel
					v-if="data?.crew && data?.crew?.length > 0"
					:data="
						sortByPosterAlphabetized(data?.crew, 'profile', 'id').slice(
							0,
							50,
						)
					"
					title="Crew"
				/>

				<ImageCarousel
					v-if="data?.posters && data?.posters?.length > 0"
					:data="data?.posters"
					title="Poster"
					type="poster"
				/>

				<ImageCarousel
					v-if="data?.backdrops && data?.backdrops?.length > 0"
					:color-palette="data?.color_palette?.poster"
					:data="data?.backdrops"
					title="Backdrop"
					type="backdrop"
				/>

				<MediaCarousel
					v-if="data?.recommendations && data?.recommendations?.length > 0"
					:color-palette="data?.color_palette"
					:data="data?.recommendations"
					title="Recommendations"
					type="poster"
				/>

				<MediaCarousel
					v-if="data?.similar && data?.similar?.length > 0"
					:color-palette="data?.color_palette"
					:data="data?.similar"
					title="Similar"
					type="poster"
				/>
			</div>

			<Trailer
				v-if="resolvedTrailer && trailerOpen"
				:resolved-trailer="resolvedTrailer"
				:toggle="toggleTrailer"
				class="inset-0 h-full w-full z-999"
			/>
		</div>
	</ScrollContainer>
	<MissingEpisodes :close="closeMissingEpisodesModal" :open="missingEpisodesModalOpen" />
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
