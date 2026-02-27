<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { collect } from 'collect.js';

import type { CollectionResponse } from '@/types/api/base/collection';

import i18next from '@/config/i18next';
import useServerClient from '@/lib/clients/useServerClient';
import { setBackground, setColorPalette } from '@/store/ui';
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
import type { ShareOptions } from '@capacitor/share';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import { buttonClasses } from '@/config/global.ts';
import ListControlHeaderMoreMenu from '@/Layout/Desktop/components/Menus/ListControlHeaderMoreMenu.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import serverClient from '@/lib/clients/serverClient.ts';
import type { IMenuItem } from '@/types';
import { useToast } from 'primevue/usetoast';
import { pickPaletteColor } from '@/lib/colorHelper.ts';
import TMDBImage from '@/components/Images/TMDBImage.vue';

const route = useRoute();
const { t } = useTranslation();
const toast = useToast();

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
});

onUnmounted(() => {
	setBackground(null);
	setColorPalette(null);

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

// Info items configuration
const infoItems = computed(() => [
	{
		show: !!data.value?.content_ratings,
		label: 'Content rating',
		component: 'ContentRating',
		data: data.value?.content_ratings,
	},
	{
		show: true,
		label: 'Availability',
		value: `${data.value?.have_items} / ${data.value?.number_of_items}`,
	},
	{
		show: true,
		label: 'Timespan',
		value: yearSpan.value,
	},
	{
		show: !!data.value?.total_duration,
		label: 'Total duration',
		value: duration.value,
	},
]);

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
			window.open(`https://www.themoviedb.org/${data?.value?.media_type}/${data?.value?.id}/edit`, '_blank');
		},
		title: 'Edit on TMDb',
	},
]);
</script>

<template>
	<NotFound v-if="isError && !data" />
	<ScrollContainer v-else :auto-hide="true" :static="true">
		<article class="w-available text-surface-12">
			<FloatingBackButton />
			<section
				v-if="data"
				class="w-available overflow-x-clip relative mt-12 flex flex-grow flex-col items-start justify-start gap-4 self-stretch py-5"
			>
				<div class="z-0 flex w-full flex-grow items-end justify-end gap-2">
					<div class="z-0 flex w-full flex-grow flex-col items-end justify-end gap-2">
						<!-- Title and Overview -->
						<h1 class="ml-4 w-full self-stretch text-5xl font-bold px-4">
							{{ data?.title?.replace(/(: | en de )/, "\n") }}
						</h1>
						<p class="ml-4 w-full self-stretch text-lg px-4">
							{{ data?.overview }}
						</p>
					</div>

					<div
						class="children:absolute relative top-6 bottom-0 col-start-1 col-end-2 flex h-auto w-auto select-none justify-end max-w-[20vw] w-available translate-x-[4px] sm:h-40 lg:max-w-[30vw] aspect-[32/8] fade-up -mb-6"
					>
						<TMDBImage v-if="data?.logo"
							:key="data?.logo"
							:auto-shadow="true"
							:path="data?.logo"
							:shadow="pickPaletteColor(data?.color_palette?.poster)"
							:size="500"
							:title="data?.title"
							class="pointer-events-none relative mx-auto flex h-full w-full select-none place-self-start overflow-hidden items-end justify-end"
							class-name="relative bottom-0 h-auto w-auto"
							type="logo"
						/>
					</div>
				</div>

				<!-- Info Section -->
				<section
					class="flex flex-col items-start justify-start gap-4 self-stretch px-4 before:content-[''] before:self-stretch before:h-px before:bg-[#e2f0fd]/4 after:content-[''] after:self-stretch after:h-px after:bg-[#e2f0fd]/4"
				>
					<div class="flex items-start justify-start gap-8 self-stretch pl-4">
						<!-- Info Items -->
						<div
							v-for="(item, index) in infoItems.filter(i => i.show)"
							:key="index"
							:class="item.label === 'Genre' ? 'flex-grow text-left' : 'flex-shrink-0'"
							class="relative flex flex-col items-start justify-center gap-1"
						>
							<p class="text-xs font-bold uppercase text-surface-11">
								{{ $t(item.label) }}
							</p>

							<ContentRating
								v-if="item.component === 'ContentRating'"
								:ratings="item.data"
								:size="6"
								class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip"
							/>

							<InfoHeaderItem v-else class="!bg-surface-6/11">
								<p class="text-sm font-bold -ml-0.5">
									{{ item.value }}
								</p>
							</InfoHeaderItem>
						</div>

						<!-- Genres -->
						<div class="relative flex flex-grow flex-col items-start justify-center text-left gap-1">
							<p class="text-xs font-bold uppercase text-surface-11">
								{{ $t("Genre") }}
							</p>
							<div
								:class="data?.genres?.length > 5 ? 'children:grayscale' : ''"
								class="flex flex-wrap self-stretch overflow-clip font-medium gap-0.5 p-1"
							>
								<GenrePill
									v-for="genre in data?.genres"
									:key="genre.id"
									:genre="genre"
								/>
							</div>
						</div>

						<!-- Action Buttons -->
						<nav
							v-if="data"
							class="relative ml-auto flex h-16 items-center justify-center gap-4"
						>
							<RouterLink
								:class="buttonClasses"
								:to="`${data?.link}/watch`"
								class="!bg-surface-6/11 group/play relative"
							>
								<MoooomIcon class-name="w-6" icon="play" />

								<div
									class="absolute top-3 grid h-0 w-max origin-bottom group-hover/play:grid-cols-1 items-center justify-start bg-black duration-200 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all left-[-31px] group-hover/play:top-[-38px] rounded-[5.46px] overflow-hidden"
								>
									<p class="py-0 text-xs font-bold px-2.5">
										{{ $t("Ends at") }} {{ endTime }}
									</p>
								</div>
							</RouterLink>

							<MediaLikeButton
								v-if="data"
								:data="data"
								class="!bg-surface-6/11"
								type="video"
							/>

							<ShareButton :share-data="shareData" class="!bg-surface-6/11 !p-0" />

							<ListControlHeaderMoreMenu
								:items="menuItems"
								class="text-surface-12/70 dark:text-surface-12/80 "
							/>
						</nav>
					</div>
				</section>

				<!-- Media Grid -->
				<section
					:class="showBackdrops ? 'media-backdrop-grid' : 'media-poster-grid'"
					class="items-start justify-start gap-4 self-stretch px-4"
				>
					<MediaCard
						v-for="movie in data?.collection ?? []"
						:key="movie?.id"
						:data="movie"
						class=""
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
			</section>
		</article>
	</ScrollContainer>
</template>

<style scoped>
ion-content::part(background) {
	background: rgb(0 0 0 / 60%);
}
</style>
