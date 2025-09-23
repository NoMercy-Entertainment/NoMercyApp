<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';
import { collect } from 'collect.js';

import type { CollectionResponse } from '@/types/api/base/collection';

import i18next from '@/config/i18next';
import useServerClient from '@/lib/clients/useServerClient';
import { setBackground, setColorPalette } from '@/store/ui';
import { setTitle, sortByPosterAlphabetized, unique } from '@/lib/stringArray';
import { convertToHumanReact } from '@/lib/dateTime';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import GenrePill from '@/components/Buttons/GenrePill.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
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
import { MenuButton } from '@headlessui/vue';

const { t } = useTranslation();
const route = useRoute();

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
	title: data.value?.title ?? '',
	text: data.value?.overview ?? '',
	url: `https://app.nomercy.tv${route.fullPath}`,
}));

const duration = computed(() => {
	if (!data.value?.total_duration)
		return null;

	return convertToHumanReact(t, data.value.total_duration ?? 0, true);
});

const yearSpan = computed(() => `${collect(data.value?.collection).min('year')} - ${collect(data.value?.collection).max('year')}`);
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data" />
			<ScrollContainer v-else :auto-hide="true" :static="true">
				<div class="w-available">
					<FloatingBackButton />
					<div
						v-if="data"
						class="w-available overflow-x-clip relative mt-12 flex flex-grow flex-col items-start justify-start gap-4 self-stretch py-5"
					>
						<p
							class="ml-4 w-full flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold px-4"
						>
							{{ data?.title?.replace(/(: | en de )/, "\n") }}
						</p>
						<p
							class="ml-4 w-full flex-shrink-0 flex-grow-0 self-stretch text-lg px-4"
						>
							{{ data?.overview }}
						</p>
						<div
							class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch px-4"
						>
							<div
								class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch"
							>
								<div class="self-stretch h-px bg-[#e2f0fd]/4" />
								<div
									class="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-8 self-stretch pl-4"
								>
									<div
										class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1"
									>
										<p
											class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11"
										>
											{{ $t("Content rating") }}
										</p>

										<ContentRating
											v-if="data?.content_ratings"
											:ratings="data?.content_ratings"
											:size="6"
											class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip"
										/>
									</div>
									<div
										class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1"
									>
										<p
											class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11"
										>
											{{ $t("Availability") }}
										</p>

										<InfoHeaderItem class="!bg-surface-6/11">
											<p
												class="flex-shrink-0 flex-grow-0 text-sm font-bold -ml-0.5"
											>
												{{ data?.have_items }} / {{ data?.number_of_items }}
											</p>
										</InfoHeaderItem>
									</div>
									<div
										class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1"
									>
										<p
											class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11"
										>
											{{ $t("Timespan") }}
										</p>
										<InfoHeaderItem class="!bg-surface-6/11">
											<p
												class="flex-shrink-0 flex-grow-0 text-sm font-bold -ml-0.5"
											>
												{{ yearSpan }}
											</p>
										</InfoHeaderItem>
									</div>
									<div
										class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1"
									>
										<p
											class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11"
										>
											{{ $t("Total duration") }}
										</p>
										<InfoHeaderItem v-if="data?.total_duration" class="!bg-surface-6/11">
											<p
												class="flex-shrink-0 flex-grow-0 text-sm font-bold -ml-0.5"
											>
												{{ duration }}
											</p>
										</InfoHeaderItem>
									</div>
									<div
										class="relative flex flex-grow flex-col items-start justify-center text-left gap-1"
									>
										<p
											class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11"
										>
											{{ $t("Genre") }}
										</p>
										<div
											:class="
												data?.genres?.length > 5 ? 'children:grayscale' : ''
											"
											class="flex flex-shrink-0 flex-grow-0 flex-wrap self-stretch overflow-clip font-medium gap-0.5"
										>
											<template v-for="genre in data?.genres" :key="genre.id">
												<GenrePill :genre="genre" />
											</template>
										</div>
									</div>

									<div
										v-if="data"
										class="relative ml-auto flex h-16 flex-shrink-0 flex-grow-0 items-center justify-center gap-4"
									>
										<RouterLink
											:class="buttonClasses"
											:to="`/${data?.media_type}/${data?.id}/watch`"
											class="!bg-surface-6/11"
										>
											<OptimizedIcon class-name="w-6" icon="play" />

											<div
												class="absolute top-3 grid h-0 w-max flex-shrink-0 flex-grow-0 origin-bottom group-hover/play:grid-cols-1 items-center justify-start bg-black duration-200 grid-cols-[0fr] group-hover/play:h-[32.77px] transform-all left-[-31px] group-hover/play:top-[-38px] rounded-[5.46px]"
											>
												<div class="overflow-hidden">
													<p
														class="flex-shrink-0 flex-grow-0 py-0 text-xs font-bold px-2.5"
													>
														{{ $t("Ends at") }}
														{{ endTime }}
													</p>
												</div>
											</div>
										</RouterLink>
										<MediaLikeButton
											v-if="data" :data="data" class="!bg-surface-6/11"
										/>

										<ShareButton
											:share-data="shareData"
											class="!bg-surface-6/11 !p-0"
										/>
										<ListControlHeaderMoreMenu
											:items="[]"
											class="text-surface-12/70 dark:text-surface-12/80"
											class-name="max-h-80 overflow-y-auto overflow-x-hidden  !ml-0 !-translate-x-1/3"
										>
											<template #button>
												<MenuButton
													:class="buttonClasses"
													class="!bg-surface-6/11"
												>
													<OptimizedIcon
														class-name="w-6"
														icon="menuDotsVertical"
													/>
												</MenuButton>
											</template>
										</ListControlHeaderMoreMenu>
									</div>
								</div>
								<div class="self-stretch h-px bg-[#e2f0fd]/4" />
							</div>
						</div>

						<div
							:class="
								showBackdrops ? 'media-backdrop-grid' : 'media-poster-grid'
							"
							class="flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch px-4"
						>
							<template
								v-for="movie in data?.collection ?? []"
								:key="movie?.id"
							>
								<MediaCard :data="movie" class="" />
							</template>
						</div>

						<PersonCarousel
							v-if="data?.cast && data?.cast?.length > 0"
							id="cast"
							:data="unique(data?.cast, 'id').slice(0, 50)"
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
		</IonContent>
	</IonPage>
</template>

<style scoped>
ion-content::part(background) {
	background: rgb(0 0 0 / 60%);
}
</style>
