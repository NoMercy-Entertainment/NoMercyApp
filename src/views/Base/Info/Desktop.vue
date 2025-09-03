<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { IonContent, IonPage } from '@ionic/vue';
import type { ShareOptions } from '@capacitor/share';

import type { InfoResponse } from '@/types/api/base/info';
import type { MoooomIcons } from '@Icons/icons';

import { isNative } from '@/config/global';
import i18next from '@/config/i18next';

import useServerClient from '@/lib/clients/useServerClient';
import { setTitle, sortByPosterAlphabetized, translate } from '@/lib/stringArray';
import { pickPaletteColor } from '@/lib/colorHelper';
import serverClient from '@/lib/clients/serverClient';
import { convertToHumanReact } from '@/lib/dateTime';
import {
	background,
	setBackground,
	setColorPalette,
	setLogo,
} from '@/store/ui';
import { currentSong } from '@/store/audioPlayer';
import { currentServer } from '@/store/currentServer';

import ListControlHeaderMoreMenu from '@/Layout/Desktop/components/Menus/ListControlHeaderMoreMenu.vue';

import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
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
import { MenuItem } from '@headlessui/vue';
import MissingEpisodes from '@/views/Base/Info/components/MissingEpisodes.vue';
import { useToast } from 'primevue/usetoast';
import sidebar from '@/store/sidebar.ts';

const route = useRoute();

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

const trailerOpen = ref(false);
const trailerState = ref<true | false | 'loading'>('loading');
const trailerIndex = ref(-1);
const endTime = ref<string | 0 | null | undefined>(null);
const interval = ref<NodeJS.Timeout | null>(null);
const { t } = useTranslation();

const toast = useToast();

const missingEpisodesModalOpen = ref(false);
function openMissingEpisodesContentModal() {
	missingEpisodesModalOpen.value = true;
}
function closeMissingEpisodesModal() {
	missingEpisodesModalOpen.value = false;
}

function processTrailer(value: InfoResponse | undefined) {
	trailerState.value = 'loading';

	if (
		!value
		|| value.videos?.length === 0
		|| !value.videos?.[trailerIndex.value]
	) {
		trailerState.value = false;
		return;
	}

	endTime.value = value.duration && new Date(new Date().getTime() + value.duration * 60 * 1000)
		.toLocaleTimeString(i18next.language ?? 'en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});

	interval.value = setInterval(() => {
		endTime.value = value.duration && new Date(new Date().getTime() + value.duration * 60 * 1000)
			.toLocaleTimeString(i18next.language ?? 'en-US', {
				hour: '2-digit',
				minute: '2-digit',
			});
	}, 1000);

	// axios
	//     .head(
	//         `https://trailer.nomercy.tv/${value.videos[trailerIndex.value]?.src}/${
	//             value.videos[trailerIndex.value]?.src
	//         }.webm`,
	//         {
	//           withCredentials: false,
	//         },
	//     )
	//     .then(() => {
	//       trailerState.value = true;
	//     })
	//     .catch(() => {
	//       incrementTrailerIndex();
	//       trailerState.value = false;
	//     });
	serverClient()
		.head(
			`trailer/${value.videos[trailerIndex.value]?.src}`,
			{
				withCredentials: false,
			},
		)
		.then(() => {
			trailerState.value = true;
		})
		.catch(() => {
			incrementTrailerIndex();
			trailerState.value = false;
		});
}

watch(data, (value) => {
	setTitle(value?.title ?? value?.name);
	if (value?.backdrop && background.value !== value?.backdrop) {
		setBackground(value?.backdrop);
	}
	if (value?.logo) {
		setLogo(value?.logo);
	}
	if (value?.color_palette?.backdrop || value?.color_palette?.poster) {
		setColorPalette(
			value?.color_palette?.poster || value?.color_palette?.backdrop,
		);
	}

	processTrailer(value);
});

onMounted(() => {
	trailerIndex.value = 0;
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
		setColorPalette(
			data?.value?.color_palette?.backdrop ?? data?.value?.color_palette?.poster,
		);
	}

	processTrailer(data?.value);
});

onUnmounted(() => {
	clearInterval(interval.value ?? undefined);
});

function toggleTrailer(e?: MouseEvent) {
	e?.stopPropagation();
	if (!data?.value?.videos)
		return;
	trailerOpen.value = !trailerOpen.value;

	const main = document.querySelector<HTMLDivElement>('#main');
	if (!main)
		return;

	main.style.overflow = trailerOpen.value ? 'hidden' : 'auto';
}

function incrementTrailerIndex() {
	if (!data?.value || data?.value?.videos?.length === 0)
		return;

	if (trailerIndex.value === data?.value?.videos.length - 1) {
		trailerIndex.value = 0;
	}
	else {
		trailerIndex.value++;
	}
}

watch(trailerIndex, (value, oldValue) => {
	if (!value || value === oldValue)
		return;

	processTrailer(data?.value);
});

function toggleWatched() {}

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
				life: 3000,
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

interface IMenuItem {
	icon: keyof typeof MoooomIcons;
	onclick: () => void;
	title: string;
	privileged?: boolean;
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
]);

const shareData = computed<ShareOptions>(() => ({
	title: data.value?.title ?? '',
	text: data.value?.overview ?? '',
	url: `https://app.nomercy.tv${route.fullPath}`,
}));
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data" />
			<ScrollContainer v-else :auto-hide="true" :static="true">
				<div
					class="z-0 flex flex-col gap-4 rounded-3xl border-0 w-available scrollbar-none border-auto-3"
					:class="{
						'pb-2': isNative && currentSong,
						'children:pb-4 sm:children:pb-3': !isNative && currentSong,
					}"
				>
					<div v-if="isError || error" class="">
						<p>{{ error }}</p>
					</div>
					<div
						class="flex flex-col gap-4 overflow-clip rounded-3xl border-0 pb-2 w-available scrollbar-none border-auto-3"
					>
						<FloatingBackButton />

						<div
							class="flex flex-col relative mx-auto w-full gap-4 rounded-lg p-4 max-w-screen-4xl justify-end min-h-[calc(100vh-6rem)]"
						>
							<div class="z-0 flex w-full flex-grow flex-col min-h-40" />
							<div
								class="z-0 flex w-full flex-grow flex-col items-end justify-end gap-2"
							>
								<div
									class="children:absolute relative right-1 bottom-0 col-start-1 col-end-2 flex h-auto w-auto select-none justify-end pb-2 max-w-[20vw] w-available translate-x-[4px] sm:h-40 lg:max-w-[30vw] aspect-[32/9]"
								>
									<TMDBImage
										v-if="data?.logo"
										:key="data?.logo"
										:auto-shadow="true"
										:path="data?.logo"
										:size="500"
										:shadow="pickPaletteColor(data?.color_palette?.poster)"
										:title="data?.title"
										class="pointer-events-none relative mx-auto flex h-full w-full select-none place-self-start overflow-hidden p-4"
										class-name="relative bottom-0 h-auto w-auto p-4"
										type="logo"
									/>
								</div>

								<div
									class="relative col-start-2 col-end-4 grid flex-shrink-0 flex-grow-0 grid-cols-3 items-start justify-start self-stretch rounded-2xl bg-gradient-to-b p-6 from-slate-light-3/12 via-slate-light-4/12 to-slate-light-4/11 dark:from-slate-dark-2/12 dark:via-slate-dark-2/12 dark:to-slate-dark-2/11 border-auto-5/8 border-1 min-h-[23.5rem]"
								>
									<div
										v-if="data?.poster"
										class="absolute z-10 col-start-1 content-center col-end-2 h-auto w-full items-start justify-start rounded-lg top-0 -translate-y-[35%] sm:block"
									>
										<RouterLink
											:to="`/${data?.media_type}/${data?.id}/watch`"
											:aria-label="$t('Play')"
											class="relative h-available m-auto mx-auto flex-1 flex max-w-[75%] scale-95 cursor-default group/card z-0 transitioning rounded-2xl aspect-poster overflow-clip select-none cover !shadow-none max-h-available  hover:!scale-100 hover:-translate-y-1"
											:class="{
												' 4xl:-mt-10 5xl:-mt-20 6xl:-mt-28 mb-20 6xl:mb-28': sidebar === 'open',
												' 4xl:-mt-2 5xl:-mt-60 6xl:-mt-28 mb-60 6xl:mb-28': sidebar !== 'open',
												'hover:!scale-100 hover:-translate-y-1': hasItem,
											}"
											data-nav="true"
											data-nav-r="play"
											data-nav-reset="true"
										>
											<TMDBImage
												:key="data?.poster || 'poster'"
												:auto-shadow="true"
												:path="data?.poster"
												:color-palette="data?.color_palette?.poster"
												:size="760"
												priority="high"
												:title="data?.title"
												aspect="poster"
												class-name="pointer-events-none absolute -inset-1 z-20 flex aspect-poster scale-100 select-none items-center place-self-start overflow-hidden rounded-2xl !w-auto !h-auto max-h-available"
												class="m-auto !w-full !h-full children:w-auto scale-100 rounded-2xl aspect-poster 5xl:w-inherit flex"
												type="image"
											/>

											<span
												:class="`tv:group-focus-visible/card:bg-black/3 absolute -inset-1 z-20 grid h-auto w-available items-center rounded-lg aspect-poster transition-transform duration-200 opacity-0 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] mx-auto w-max ${
													hasItem ? 'group-hover/card:opacity-100' : ''
												}`"
											>
												<span
													class="inset-0 grid group-hover/card:grid h-full w-full place-content-center group-focus-visible/card:bg-none group-hover/card:bg-none text-5xl text-transparent transition-transform duration-200 group-focus-visible/card:transitioning group-hover/card:text-auto-12"
												>
													<OptimizedIcon
														icon="play"
														class-name="w-20 text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
													/>
												</span>
											</span>
										</RouterLink>
									</div>

									<p
										class="col-start-1 content-center col-end-2 mt-auto bottom-6 left-8 w-full flex-shrink-0 select-none flex-grow-0 text-sm text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
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
												class="flex-grow text-5xl font-bold w-[806px] text-auto-12"
												style="
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
													title="Play"
												>
													<OptimizedIcon
														icon="play"
														class-name="w-6 text-slate-lightA-12/70  dark:text-slate-darkA-12/80"
													/>
													<div
														class="absolute top-3 left-1/2 -translate-x-1/2 grid h-0 w-max flex-shrink-0 flex-grow-0 origin-bottom group-hover/play:grid-cols-1 items-center justify-start duration-200 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all group-hover/play:top-[-38px] rounded-[5.46px] bg-[#3a3f42] group-hover/play:border border-[#e2f0fd]/[0.08]"
														style="
                              box-shadow: 0 8px 12px -4px rgba(0, 0, 0, 0.08);
                            "
													>
														<div class="overflow-hidden">
															<p
																class="flex-shrink-0 flex-grow-0 py-0 text-center text-xs font-bold px-2.5"
															>
																{{ $t("Ends at") }} {{ endTime }}
															</p>
														</div>
													</div>
												</BannerButton>
												<div
													v-else
													class="grid relative place-content-center w-10 h-10 active:outline outline-focus focus-visible:outline min-w-[2.5rem] z-0 justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent overflow-clip pointer-events-auto border-none focus:border-none active:border-none focus-visible:sm:ring-white focus-visible:sm:ring-2 group/button gap-2 p-2.5 items-center rounded-lg sm:bg-slate-lightA-2 dark:sm:bg-slate-darkA-2/[1%] active:sm:bg-slate-lightA-6 focus-visible:sm:bg-slate-lightA-6 hover:sm:bg-slate-lightA-6 dark:sm:active:bg-slate-darkA-6 dark:sm:focus-visible:sm:bg-slate-darkA-6 dark:sm:hover:bg-slate-darkA-6 ${isActive ? 'text-focus' : 'text-auto-12"
												>
													<OptimizedIcon
														icon="play"
														class-name="w-6 text-red-dark-8"
													/>

													<div
														class="absolute top-3 grid h-0 w-max flex-shrink-0 origin-bottom group-hover/play:grid-cols-1 items-center justify-start bg-black duration-200 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all left-[-31px] group-hover/play:top-[-38px] rounded-[5.46px]"
													>
														<div class="overflow-hidden">
															<p
																class="flex-shrink-0 py-0 text-xs font-bold px-2.5"
															>
																{{ $t("Not available") }}
															</p>
														</div>
													</div>
												</div>
												<BannerButton
													title="$t('Watch trailer')"
													@click="trailerState === true ? toggleTrailer($event) : null"
												>
													<OptimizedIcon
														icon="film"
														class-name="w-6"
														:style="`color: ${
															trailerState === true
																? 'rgb(var(--color-green-8))'
																: 'rgb(var(--color-red-8))'
														}`"
													/>
												</BannerButton>

												<BannerButton
													title="$t('Mark as watched')"
													@click="toggleWatched"
												>
													<OptimizedIcon
														icon="check"
														class-name="w-6 text-slate-lightA-12/70  dark:text-slate-darkA-12/80"
													/>
												</BannerButton>

												<ShareButton
													:share-data="shareData"
													class="!p-0"
												/>

												<MediaLikeButton v-if="data" :data="data" />

												<ListControlHeaderMoreMenu
													:items="
														menuItems.filter(
															(item) =>
																!item.privileged
																|| (item.privileged
																	&& (currentServer?.is_owner
																		|| currentServer?.is_manager)),
														)
													"
													class="text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
												>
													<MenuItem
														as="div"
														class="flex justify-center items-center self-stretch h-10 relative p-2 gap-3 rounded-sm border border-transparent hover:border-focus/4 active:bg-focus/9 active:border-focus/4 active:hover:border-focus/4 focus:bg-auto-12/2 hover:bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-200"
													>
														<a
															target="_blank"
															:href="`https://www.themoviedb.org/${data.media_type}/${data.id}/edit`"
															class="relative flex w-full flex-grow items-center justify-center gap-2 text-base font-semibold"
														>
															<OptimizedIcon icon="edit" />
															<span class="w-full whitespace-nowrap">
																{{ $t("Edit on TMDb") }}
															</span>
														</a>
													</MenuItem>
												</ListControlHeaderMoreMenu>
											</div>
										</div>

										<div
											v-if="data"
											class="flex flex-shrink-0 items-center justify-start gap-4 self-stretch"
										>
											<InfoHeaderItem v-if="data?.year">
												<p
													class="flex-shrink-0 text-sm font-bold uppercase text-auto-12"
												>
													{{ data?.year }}
												</p>
											</InfoHeaderItem>
											<InfoHeaderItem v-if="data?.number_of_items">
												<p
													class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase text-auto-12"
												>
													{{ data?.number_of_items }} {{ $t("ep") }}.
												</p>
											</InfoHeaderItem>
											<InfoHeaderItem v-if="data?.duration">
												<p
													class="flex-shrink-0 flex-grow-0 text-sm font-bold uppercase text-auto-12"
												>
													{{ convertToHumanReact(t, data?.duration, true) }}
												</p>
											</InfoHeaderItem>
											<InfoHeaderItem v-if="data?.voteAverage">
												<p
													class="flex-shrink-0 flex-grow-0 text-sm font-bold text-auto-12 -ml-0.5"
												>
													⭐ ️{{ data?.voteAverage?.toFixed(0) }}/10
												</p>
											</InfoHeaderItem>
											<div
												v-if="data?.content_ratings"
												class="relative overflow-hidden"
											>
												<ContentRating
													:size="6"
													class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip"
													:ratings="data?.content_ratings"
												/>
											</div>
										</div>

										<div
											v-if="data"
											class="relative flex flex-col items-start justify-start gap-2 self-stretch"
										>
											<div class="h-px bg-auto-12/10" />
											<div class="w-full text-lg font-medium text-auto-12 mb-4">
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
												title="Genres"
												key-name="genres"
												prefix="genres"
											/>
											<InfoItem
												v-if="data?.writer"
												:data="{ writer: [data?.writer] }"
												title="Writer"
												key-name="writer"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.creator"
												:data="{ creator: [data?.creator] }"
												title="Creator"
												key-name="creator"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.director"
												:data="{ director: [data?.director] }"
												title="Director"
												key-name="director"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.creators"
												:data="data"
												title="Creators"
												key-name="creators"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.directors"
												:data="data"
												title="Directors"
												key-name="directors"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.writers"
												:data="data"
												title="Writers"
												key-name="writers"
												prefix="person"
											/>
											<InfoItem
												v-if="data?.keywords"
												:data="data"
												title="Keywords"
												key-name="keywords"
											/>

											<div
												class="relative grid w-full flex-shrink-0 flex-grow-0 grid-cols-7 items-start justify-start gap-1"
											>
												<p class="grid-cols-3 text-xs font-bold uppercase text-slate-lightA-12/70 dark:text-slate-darkA-12/80">
													{{ $t("External links") }}
												</p>
												<div
													class="col-span-6 col-start-3 flex w-full max-w-fit flex-wrap gap-1 self-center xl:col-start-3 2xl:col-start-2 text-slate-lightA-12 dark:text-slate-darkA-12/80 font-semibold"
												>
													<div class="gap-1 children:whitespace-nowrap text-sm">
														<a
															:href="`https://themoviedb.org/${data?.media_type}/${data?.id}`"
															target="_blank"
															class="inline-block underline-offset-4 hover:underline focus-visible:underline"
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
						v-if="data?.videos && data?.videos?.length > 0 && trailerOpen"
						:key="trailerIndex"
						:increment-trailer-index="incrementTrailerIndex"
						:index="trailerIndex"
						:open="trailerOpen"
						:title="data?.title ?? data?.name"
						:toggle="toggleTrailer"
						:videos="data?.videos"
						class="inset-0 h-full w-full z-999"
					/>
				</div>
			</ScrollContainer>
			<MissingEpisodes :close="closeMissingEpisodesModal" :open="missingEpisodesModalOpen" />
		</IonContent>
	</IonPage>
</template>

<style scoped>
ion-content::part(background) {
	background: transparent;
}
</style>
