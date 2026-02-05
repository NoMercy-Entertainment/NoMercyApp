<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { IonContent, IonPage, IonSkeletonText, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import type { PersonResponseItem } from '@/types/api/base/person';

import { tmdbImageBaseUrl } from '@/config/config';
import { background, setBackground, setColorPalette } from '@/store/ui';

import useServerClient from '@/lib/clients/useServerClient';
import { breakTitle2, setTitle, unique } from '@/lib/stringArray';

import CreditGroup from '@/components/MusicPlayer/components/CreditGroup.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import { isNative } from '@/config/global';
import SocialLinkItems from '@/views/Base/Person/components/SocialLinkItems.vue';
import HeaderItem from '@/views/Base/Person/components/HeaderItem.vue';
import Collapsible from '@/views/Base/Person/components/Collapsible.vue';
import i18next from '@/config/i18next.ts';

const route = useRoute();
const { data, isError } = useServerClient<PersonResponseItem>({
	queryKey: ['base', 'person', route.params.id],
});

const backgroundUrl = computed(() => {
	if (!data.value?.known_for?.at(0)?.backdrop)
		return null;
	return `${tmdbImageBaseUrl}/original${
		data?.value?.known_for?.at(0)?.backdrop ?? background
	}`;
	// return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

const age = computed(() => {
	if (data.value?.deathday) {
		const birthDate = new Date(data.value?.birthday);
		const deathDay = new Date(data.value?.deathday);
		const a = deathDay.getFullYear() - birthDate.getFullYear();
		const m = deathDay.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && deathDay.getDate() < birthDate.getDate())) {
			return a - 1;
		}
		return a;
	}
	if (data.value?.birthday) {
		const birthDate = new Date(data.value?.birthday);
		const currentDate = new Date();
		const a = currentDate.getFullYear() - birthDate.getFullYear();
		const m = currentDate.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
			return a - 1;
		}
		return a;
	}
	return null;
});

const gender = computed(() => {
	if (typeof data.value?.gender !== 'number')
		return data.value?.gender;

	switch (data.value?.gender) {
		case 0:
			return 'Not specified';
		case 1:
			return 'Female';
		case 2:
			return 'Male';
		case 3:
			return 'Non-binary';
		default:
			return null;
	}
});

watch(data, (value) => {
	setTitle(data?.value?.name);
	setBackground(value?.known_for?.at(0)?.backdrop ?? null);
	setColorPalette(value?.color_palette?.profile);
});

onIonViewWillEnter(() => {
	setTitle(data?.value?.name);
	setBackground(data?.value?.known_for?.at(0)?.backdrop ?? null);
	setColorPalette(data?.value?.color_palette?.profile);
});

onIonViewWillLeave(() => {
	setBackground(null);
	setColorPalette(null);
});

const filter = 'combined';

const currentImage = ref(data.value?.images?.profiles?.[0]);

watch(data, (value) => {
	currentImage.value = value?.images?.profiles?.[0];
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
				class="flex flex-col justify-start items-center self-stretch flex-grow h-auto gap-4 will-change-auto text-surface-12 z-10 absolute left-0 w-full"
				style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16)"
			>
				<div
					class="flex justify-start items-end flex-grow-0 flex-shrink-0 -mx-4 w-available h-[400px] relative gap-2"
				>
					<SwiperComponent
						ref="swiper"
						:class="{
							'top-safe-offset-4': isNative,
							'top-12': !isNative,
						}"
						:loop="true"
						:slides-per-view="1"
						class="w-available swiper h-[420px] !absolute"
					>
						<template
							v-for="(item, index) in data?.images?.profiles ?? []"
							:key="item.id"
						>
							<SwiperSlide
								:data-id="item.src"
								:data-index="index"
								class="h-full"
							>
								<div
									class="frosting w-[280px] h-[420px] z-10 absolute left-1/2 -translate-x-1/2 overflow-clip rounded-2xl"
								>
									<TMDBImage
										v-if="item"
										:key="item.src ?? 'poster'"
										:auto-shadow="true"
										:path="item.src"
										:size="760"
										:title="data?.name"
										aspect="poster"
										class="m-auto children:w-full scale-100 max-h-available 5xl:w-inherit"
										class-name="pointer-events-none absolute -inset-1 z-20 flex h-auto scale-100 select-none items-center overflow-hidden w-available h-available max-h-available"
										loading="eager"
										priority="high"
										type="image"
									/>
								</div>
							</SwiperSlide>
						</template>
					</SwiperComponent>
				</div>
			</div>

			<div
				class="flex flex-col justify-start items-center self-stretch flex-grow gap-4 will-change-auto text-surface-12 z-0 bg-surface-3 dark:bg-surface-1"
				style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16)"
			>
				<div
					class="flex justify-start items-end -mx-4 w-available h-[400px] relative gap-2"
				>
					<div
						class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[400px] bg-cover bg-top"
						style="
              background: linear-gradient(
                  0deg,
                  rgba(0, 0, 0, 0.5) 0%,
                  rgba(0, 0, 0, 0.5) 100%
                ),
                var(--background-image) lightgray 50% / cover no-repeat;
            "
					/>
					<div
						class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[400px] bg-cover dark:bg-black/50"
					/>
				</div>

				<div
					class="flex bg-surface-3 dark:bg-surface-1 flex-col justify-start items-start self-stretch gap-3 pb-5 will-change-auto w-inherit px-6 mt-12"
				>
					<p
						v-if="data?.name"
						class="self-stretch w-[351px] text-3xl font-bold text-left z-10 pt-10"
						v-html="breakTitle2(data?.name ?? ' ', 'text-lg line-clamp-2')"
					/>
					<IonSkeletonText
						v-else
						:animated="true"
						class="h-7 will-change-auto"
					/>

					<Collapsible
						v-if="data?.biography"
						:max-lines="3"
						:text="data?.biography"
					/>

					<div class="flex flex-col gap-3 items-start flex-nowrap w-full">
						<div class="flex justify-between items-start flex-nowrap w-full">
							<HeaderItem
								v-if="data?.known_for_department"
								:data="data?.known_for_department"
								title="Known for"
							/>

							<HeaderItem
								v-if="data?.combined_credits?.cast"
								:data="data?.combined_credits?.cast.length.toString()"
								title="Credits"
							/>

							<HeaderItem v-if="age" title="Birthday">
								<template #head>
									<span
										v-if="data?.deathday"
										class="ml-auto flex gap-1 text-xs font-bold uppercase text-surface-10 whitespace-nowrap"
									>
										<span v-if="data.deathday" class="-mr-1 text-base -mt-[3px]">&#8224;</span>
										{{
											new Date(data?.deathday!).toLocaleDateString(
												i18next.language ?? "en-US",
												{
													year: "numeric",
													month: "short",
													day: "2-digit",
												},
											)
										}}
									</span>
								</template>

								<p
									v-if="age"
									class="text-left text-base font-medium self-center whitespace-nowrap"
								>
									{{
										new Date(data?.birthday!).toLocaleDateString(
											i18next.language ?? "en-US",
											{
												year: "numeric",
												month: "short",
												day: "2-digit",
											},
										)
									}}
									({{ age }} {{ $t("years old") }})
								</p>
							</HeaderItem>
						</div>

						<div
							class="flex gap-3 items-start justify-between flex-nowrap w-full"
						>
							<HeaderItem v-if="gender" :data="gender" title="Gender" />

							<HeaderItem
								v-if="data?.place_of_birth"
								:data="data?.place_of_birth"
								title="Place of birth"
							/>
						</div>
					</div>

					<div
						class="self-stretch h-px bg-surface-7/[0.1] dark:bg-surface-11/[0.1]"
					/>

					<SocialLinkItems v-if="data" :data="data" />

					<div class="mb-8 -ml-1 w-[101.5%]">
						<div class="ml-2 w-[100.6%]">
							<MediaCarousel
								v-if="data?.known_for && data?.known_for?.length > 0"
								:color-palette="data?.color_palette"
								:data="unique(data.known_for, 'id')"
								class="-mx-6"
								title="Known for"
								type="poster"
							/>
						</div>
					</div>

					<div
						class="self-stretch h-px bg-surface-7/[0.1] dark:bg-surface-11/[0.1]"
					/>

					<CreditGroup
						:items="data?.[`${filter}_credits`]?.cast"
						title="Acting"
					/>
					<CreditGroup
						:items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Produc'))"
						title="Production"
					/>
					<CreditGroup
						:items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Writ'))"
						title="Writing"
					/>
					<CreditGroup
						:items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Direct'))"
						title="Directing"
					/>
					<CreditGroup
						:items="data?.[`${filter}_credits`]?.crew.filter((c: any) => !c.job.includes('Produc') && !c.job.includes('Writ') && !c.job.includes('Direct') && !c.job.includes('Creator'))"
						title="Crew"
					/>
					<CreditGroup
						:items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Creator'))"
						title="Creator"
					/>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<style scoped>
:root {
	--background-image: none;
}
</style>
