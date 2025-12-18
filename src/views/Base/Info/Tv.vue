<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, IonSkeletonText } from '@ionic/vue';

import type { InfoResponse } from '@/types/api/base/info';

import { tmdbImageBaseUrl } from '@/config/config';
import useServerClient from '@/lib/clients/useServerClient';
import { setTitle, sortByPosterAlphabetized } from '@/lib/stringArray';
import { background, setBackground, setColorPalette, setLogo } from '@/store/ui';
import router from '@/router';

import InfoItem from '@/views/Base/Info/components/InfoItem.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import ImageCarousel from '@/components/Carousel/ImageCarousel.vue';
import PersonCarousel from '@/components/Carousel/PersonCarousel.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import ContentRating from '@/components/Images/ContentRating.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();
const enabled = ref(false);
const showMore = ref(false);
const trailerOpen = ref(false);

const content = ref<VueDivElement>();
const backgroundUrl = computed(() => {
	return `${tmdbImageBaseUrl}/original${background.value}`;
	// return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

const { data } = useServerClient<InfoResponse>({
	keepForever: true,
	path: route?.fullPath,
});

const { data: hasItem } = useServerClient<{
	available: boolean;
	server: string;
}>({
	path: `${route?.fullPath}/available`,
	enabled,
});

watch(data, (value) => {
	content.value?.$el?.scrollToTop(window.innerHeight);
	enabled.value = true;

	setTitle(value?.title ?? value?.name);

	if (value?.backdrop && background.value !== value?.backdrop) {
		setBackground(value?.backdrop);
	}
	if (value?.logo) {
		setLogo(value?.logo);
	}
	if (value?.color_palette?.poster) {
		setColorPalette(value?.color_palette?.backdrop);
	}
});

onMounted(() => {
	content.value?.$el?.scrollToTop(window.innerHeight);
	// trailerIndex.value = 0;
	setTitle(data?.value?.name);

	if (data?.value?.backdrop && background.value !== data?.value?.backdrop) {
		setBackground(data?.value?.backdrop);
	}
	if (data?.value?.logo) {
		setLogo(data?.value?.logo);
	}
	if (data?.value?.color_palette?.poster) {
		setColorPalette(data?.value?.color_palette?.poster);
	}
	// processTrailer(data?.value);
});

onUnmounted(() => {
	content.value?.$el?.scrollToTop(window.innerHeight);
});

router.afterEach(() => {
	setTimeout(() => {
		content.value?.$el?.scrollToTop(window.innerHeight);
	}, 100);
});
</script>

<template>
	<IonPage>
		<IonContent
			ref="content"
			:fullscreen="true"
			:style="`--background-image: ${
				backgroundUrl && !backgroundUrl.includes('null')
					? `url(${backgroundUrl})`
					: ''
			};`"
		>
			<div
				class="flex flex-col justify-start items-center self-stretch flex-grow overflow-hidden bg-surface-3 dark:bg-surface-1 -mr-2 px-2 pr-0 pt-safe pb-safe gap-4 will-change-auto"
				style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16)"
			>
				<div
					class="flex justify-start items-end flex-grow-0 flex-shrink-0 w-[375px] h-[404px] relative gap-2 bg-black/50"
				>
					<div
						class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-8 h-[450px] gap-2 pt-[380px] bg-cover [background-image:var(--background-image)] bg-top"
					/>
					<div
						class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-8 h-[450px] gap-2 pt-[380px] bg-cover bg-black/50"
					/>

					<div
						class="flex-grow-0 flex-shrink-0 w-[280px] h-[420px] absolute left-10 top-10 overflow-hidden rounded-2xl"
					>
						<div
							class="flex flex-col justify-start items-start w-[280px] absolute left-0 top-0 bg-cover bg-no-repeat bg-center"
						>
							<TMDBImage
								v-if="data?.poster"
								:key="data?.poster ?? 'poster'"
								:auto-shadow="true"
								:color-palette="data?.color_palette?.poster"
								:path="data?.poster"
								:size="760"
								:title="data?.title"
								aspect="poster"
								class="m-auto children:w-full scale-100 rounded-2xl max-h-available 5xl:w-inherit"
								class-name="pointer-events-none absolute -inset-1 z-20 flex h-auto scale-100 select-none items-center place-self-start overflow-hidden rounded-2xl w-available h-available max-h-available"
								loading="eager"
								priority="high"
								type="image"
							/>
						</div>

						<svg
							class="w-[280px] h-[122px] absolute left-0 top-[298px] blur-sm"
							fill="none"
							height="123"
							preserveAspectRatio="none"
							viewBox="0 0 280 123"
							width="280"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g filter="url(#filter0_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="122"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<g filter="url(#filter1_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="106"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<g filter="url(#filter2_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="90"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<g filter="url(#filter3_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="74"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<g filter="url(#filter4_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="58"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<g filter="url(#filter5_bf_5719_22815)">
								<rect
									fill="var(--color-theme-8)"
									fill-opacity="0.05"
									height="42"
									transform="matrix(1 0 0 -1 0 123)"
									width="280"
								/>
							</g>
							<defs>
								<filter
									id="filter0_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="124"
									width="282"
									x="-1"
									y="0"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="0.5"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="0.5"
									/>
								</filter>
								<filter
									id="filter1_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="110"
									width="284"
									x="-2"
									y="15"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="1"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="1"
									/>
								</filter>
								<filter
									id="filter2_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="96"
									width="286"
									x="-3"
									y="30"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="1.5"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="1.5"
									/>
								</filter>
								<filter
									id="filter3_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="82"
									width="288"
									x="-4"
									y="45"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="2"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="2"
									/>
								</filter>
								<filter
									id="filter4_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="68"
									width="290"
									x="-5"
									y="60"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="2.5"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="2.5"
									/>
								</filter>
								<filter
									id="filter5_bf_5719_22815"
									color-interpolation-filters="sRGB"
									filterUnits="userSpaceOnUse"
									height="54"
									width="292"
									x="-6"
									y="75"
								>
									<feFlood
										flood-opacity="0"
										result="BackgroundImageFix"
									/>
									<feGaussianBlur
										in="BackgroundImageFix"
										stdDeviation="3"
									/>
									<feComposite
										in2="SourceAlpha"
										operator="in"
										result="effect1_backgroundBlur_5719_22815"
									/>
									<feBlend
										in="SourceGraphic"
										in2="effect1_backgroundBlur_5719_22815"
										mode="normal"
										result="shape"
									/>
									<feGaussianBlur
										result="effect2_foregroundBlur_5719_22815"
										stdDeviation="3"
									/>
								</filter>
							</defs>
						</svg>

						<div
							class="flex justify-start items-start w-[280px] absolute left-0 top-[348px] gap-4 p-4"
						>
							<RouterLink
								:class="{ 'opacity-70': !hasItem?.available }"
								:disabled="!hasItem?.available"
								:to="`${data?.link}/watch`"
								class="flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-[30px] bg-white/80"
							>
								<p
									class="flex-grow w-[100px] text-[15px] font-semibold text-center text-[#151718]"
								>
									{{
										$t(
											!data
												? "loading"
												: hasItem?.available
													? "Play"
													: "Unavailable",
										)
									}}
								</p>
							</RouterLink>

							<button
								class="flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-[30px] bg-black/50 border border-solid border-slate-9 dark:border-slate-9"
								@click="trailerOpen = !trailerOpen"
							>
								<p
									class="flex-grow w-[100px] text-[15px] font-semibold text-center"
								>
									{{ $t(!data ? "loading" : "Trailer") }}
								</p>
							</button>
						</div>

						<div
							class="flex justify-end items-start w-[280px] absolute left-0 top-0 gap-2 p-4"
						>
							<div
								class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 p-2 rounded-[30px] bg-black/[0.48] border border-black/2"
							>
								<MoooomIcon class-name="w-5" icon="check" />
							</div>
							<div
								class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 p-2 rounded-[30px] bg-black/[0.48] border border-black/2"
							>
								<MoooomIcon class-name="w-5" icon="heartFilled" />
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-3 px-3 pt-16 will-change-auto"
				>
					<p
						v-if="data?.title"
						class="self-stretch flex-grow-0 flex-shrink-0 w-[351px] text-4xl font-bold text-left"
					>
						{{ data?.title ?? "&nbsp;" }}
					</p>
					<IonSkeletonText
						v-else
						:animated="true"
						class="h-8 will-change-auto"
					/>

					<div
						v-if="data?.overview"
						class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1"
					>
						<p
							:class="{
								[`max-h-[4em] h-[4em] after:content-['...'] after:absolute after:top-[2.8em] after:ml-[64%]`]:
									(data?.overview?.length ?? 0) > 170 && !showMore,
								[`max-h-[40em] h-auto`]: showMore,
							}"
							class="self-stretch flex-grow-0 flex-shrink-0 w-[352px] text-base font-medium text-left min-h-[4rem] transition-all duration-200 overflow-hidden relative pr-3.5"
						>
							{{ data?.overview ?? "&nbsp;" }}
						</p>
						<div
							v-if="(data?.overview?.length ?? 0) > 170"
							class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-5 relative overflow-hidden gap-2"
						>
							<button
								class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left/[0.92] underline underline-offset-2"
								@click="showMore = !showMore"
							>
								{{ $t("Read more") }}
							</button>
						</div>
					</div>
					<IonSkeletonText
						v-else
						:animated="true"
						class="h-[4.55rem] will-change-auto"
					/>

					<div
						class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-[#e2f0fd]/[0.08]"
					/>

					<div
						v-if="data?.year"
						class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 h-8"
					>
						<ContentRating
							v-if="data?.content_ratings"
							:ratings="data?.content_ratings"
							:size="8"
							class="h-full min-!h-[1rem] object-scale-down rounded-lg overflow-clip children:-m-0.5"
						/>

						<div
							v-if="data?.have_items"
							class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-7 px-2 py-1 rounded-md bg-[#e2f0fd]/[0.08] border border-[#dfeffe]/[0.14]"
						>
							<div
								class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1"
							>
								<p
									class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center"
								>
									{{ data?.have_items }}/{{ data?.number_of_items }}
								</p>
							</div>
						</div>

						<div
							v-if="data?.year"
							class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-7 px-2 py-1 rounded-md bg-[#e2f0fd]/[0.08] border border-[#dfeffe]/[0.14]"
						>
							<div
								class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1"
							>
								<p
									class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center"
								>
									{{ data?.year }}
								</p>
							</div>
						</div>
					</div>
					<IonSkeletonText
						v-else
						:animated="true"
						class="h-8 will-change-auto"
					/>

					<div
						v-if="data?.genres"
						class="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1 min-h-12"
					>
						<p
							class="flex-grow-0 flex-shrink-0 w-[120px] text-xs font-bold text-left text-[#9ba1a6]"
						>
							{{ $t("Genres") }}
						</p>
						<div
							class="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-1"
						>
							<InfoItem
								:data="data"
								key-name="genres"
								prefix="genres"
								title="Genres"
							/>
						</div>
					</div>
					<IonSkeletonText
						v-else
						:animated="true"
						class="h-12 will-change-auto"
					/>
					<div
						class="self-stretch flex-grow-0 flex-shrink-0 h-px bg-[#e2f0fd]/[0.08]"
					/>
				</div>

				<PersonCarousel
					v-if="data?.cast && data?.cast?.length > 0"
					:data="data?.cast"
					title="Cast"
				/>

				<PersonCarousel
					v-if="data?.crew && data?.crew?.length > 0"
					:data="sortByPosterAlphabetized(data?.crew, 'profile', 'id')"
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
		</IonContent>
	</IonPage>
</template>

<style scoped>
:root {
	--background-image: none;
}
</style>
