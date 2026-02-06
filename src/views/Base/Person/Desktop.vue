<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';

import type { PersonResponseItem } from '@/types/api/base/person';

import { setBackground, setColorPalette } from '@/store/ui';
import { breakDescription, breakTitle, setTitle } from '@/lib/utils/string';
import { unique } from '@/lib/utils/array';
import useServerClient from '@/lib/clients/useServerClient';
import { isNative } from '@/config/global';
import i18next from '@/config/i18next';
import { currentSong } from '@/store/audioPlayer';

import SpriteIcon from '@/components/Images/icons/SpriteIcon.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import CreditGroup from '@/components/MusicPlayer/components/CreditGroup.vue';
import FloatingPersonCard from '@/components/MusicPlayer/components/FloatingPersonCard.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';
import ListControlHeaderMoreMenu from '@/Layout/Desktop/components/Menus/ListControlHeaderMoreMenu.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import type { MoooomIcons } from '@Icons/icons.ts';

const route = useRoute();
const { data, isError } = useServerClient<PersonResponseItem>({
	queryKey: ['base', 'person', route.params.id],
});

const age = computed(() => {
	if (data.value?.deathday) {
		const birthDate = new Date(data.value?.birthday);
		const deathday = new Date(data.value?.deathday);
		const a = deathday.getFullYear() - birthDate.getFullYear();
		const m = deathday.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && deathday.getDate() < birthDate.getDate())) {
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
});

onMounted(() => {
	setTitle(data?.value?.name);
	setColorPalette(null);
	setBackground(data?.value?.known_for?.at(0)?.backdrop ?? null);
});

onUnmounted(() => {
	setBackground(null);
	setColorPalette(null);
});

interface IMenuItem {
	icon: keyof typeof MoooomIcons;
	onclick: () => void;
	title: string;
	privileged?: boolean;
}

const menuItems = computed<IMenuItem[]>(() => [
	{
		icon: 'edit',
		onclick: () => {
			window.open(`https://www.themoviedb.org/person/${data.value?.id}/edit`, '_blank');
		},
		title: 'Edit on TMDb',
	},
]);

const filter = 'combined';

// Info fields configuration
const infoFields = computed(() => [
	{
		show: !!data.value?.known_for_department,
		label: 'Known For',
		value: data.value?.known_for_department,
		class: 'sm:w-[30%] lg:w-[15%] xl:w-[15%] 2xl:w-[11%]',
	},
	{
		show: !!data.value?.combined_credits?.cast,
		label: 'Known Credits',
		value: data.value?.combined_credits?.cast?.length,
		class: 'sm:w-[39%] lg:w-[20%] xl:w-[20%] 2xl:w-[14%]',
	},
	{
		show: !!gender.value,
		label: 'Gender',
		value: gender.value,
		class: 'sm:w-[25%] lg:w-[15%] xl:w-[9%]',
	},
	{
		show: !!age.value,
		label: 'Birthday',
		value: age.value ? `${new Date(data.value?.birthday!).toLocaleDateString(i18next.language ?? 'en-US', { year: 'numeric', month: 'short', day: '2-digit' })} (${age.value} ${i18next.t('years old')})` : '',
		class: 'lg:w-auto 2xl:w-[23%]',
		hasDeathday: !!data.value?.deathday,
		deathday: data.value?.deathday ? new Date(data.value.deathday).toLocaleDateString(i18next.language ?? 'en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : '',
	},
	{
		show: !!data.value?.place_of_birth,
		label: 'Place of Birth',
		value: data.value?.place_of_birth,
		class: 'lg:w-auto xl:flex-grow',
	},
]);

// Social links configuration
const socialLinks = computed(() => [
	{ show: true, href: `https://www.themoviedb.org/person/${data.value?.id}`, icon: 'tmdb', title: 'TMDB', iconClass: '!w-12' },
	{ show: !!data.value?.external_ids?.facebook_id, href: `https://www.facebook.com/${data.value?.external_ids?.facebook_id}`, icon: 'facebook', title: 'Facebook' },
	{ show: !!data.value?.external_ids?.twitter_id, href: `https://twitter.com/${data.value?.external_ids?.twitter_id}`, icon: 'twitter', title: 'Twitter' },
	{ show: !!data.value?.external_ids?.instagram_id, href: `https://instagram.com/${data.value?.external_ids?.instagram_id}`, icon: 'instagram', title: 'Instagram' },
	{ show: !!data.value?.external_ids?.youtube_id, href: `https://youtube.com/channel/${data.value?.external_ids?.youtube_id}`, icon: 'youtube', title: 'YouTube' },
	{ show: !!data.value?.external_ids?.tiktok_id, href: `https://tiktok.com/@${data.value?.external_ids?.tiktok_id}`, icon: 'tiktok', title: 'TikTok' },
	{ show: !!data.value?.external_ids?.imdb_id, href: `https://www.imdb.com/name/${data.value?.external_ids?.imdb_id}`, icon: 'imdb', title: 'IMDb' },
	{ show: !!data.value?.external_ids?.wikidata_id, href: `https://www.wikidata.org/wiki/${data.value?.external_ids?.wikidata_id}`, icon: 'wikipedia', title: 'Wikidata' },
].filter(link => link.show));
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data" />
			<ScrollContainer v-else :auto-hide="true" :static="true">
				<article
					v-if="data"
					:class="{
						'pb-24': isNative && !currentSong,
						'pb-40': isNative && currentSong,
						'children:pb-4 sm:children:pb-3': !isNative && currentSong,
					}"
					class="flex bg-black/50 w-available relative text-surface-12"
				>
					<div
						class="relative mx-auto flex w-full items-end justify-start gap-4 rounded-lg p-4 max-w-screen-5xl pt-[290px]"
					>
						<section
							:class="`w-available flex flex-col gap-4 items-start rounded-2xl pr-4 pl-52 bg-gradient-to-b from-surface-1/12 via-surface-1/12 to-surface-1/11 border-1 sm:py-2 sm:pl-64 2xl:pl-96 ${
								!!data?.deathday ? 'border-surface-12' : 'border-surface-12/4'
							}`"
						>
							<!-- Header with Name and Social Links -->
							<header
								class="relative mt-8 -mb-2 flex flex-col justify-start self-stretch sm:mt-4 sm:items-center sm:gap-4 lg:flex-row after:content-[''] after:mt-4 after:h-px after:self-stretch after:bg-white/10 sm:after:mt-0"
							>
								<h1
									:style="`font-size: min(calc(150px / ${data?.name?.length} + 3ch), 2rem)`"
									class="mb-2 flex-grow text-5xl font-bold leading-[150%]"
								>
									{{ breakTitle(data?.name ?? "", "text-base sm:text-xl -mt-2") }}
								</h1>

								<nav class="ml-auto flex items-center justify-end gap-2" style="width: 432px">
									<BannerButton
										v-for="link in socialLinks"
										:key="link.icon"
										:href="link.href"
										:title="link.title"
										class="bg-surface-6"
										target="_blank"
									>
										<SpriteIcon :class="link.iconClass || 'w-6'" :icon="link.icon" />
									</BannerButton>

									<ListControlHeaderMoreMenu
										:items="menuItems"
										class="text-surface-12/70 dark:text-surface-12/80"
									/>
								</nav>
							</header>

							<!-- Info Grid -->
							<section
								class="relative flex flex-col items-start justify-start self-stretch py-4 sm:gap-4 after:content-[''] after:mt-4 after:h-px after:self-stretch after:bg-white/10 sm:after:mt-0"
							>
								<div class="flex w-full flex-col flex-wrap items-start gap-6 sm:flex-row sm:gap-2">
									<div
										v-for="(field, index) in infoFields.filter(f => f.show)"
										:key="index"
										:class="field.class"
										class="relative flex w-auto flex-col items-start justify-center gap-1"
									>
										<p class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11 w-full">
											{{ $t(field.label) }}
											<span
												v-if="field.hasDeathday"
												class="mr-8 ml-auto flex flex-shrink-0 flex-grow-0 gap-2"
											>
												<span class="-mr-1 text-base -mt-[3px]">&#8224;</span>
												{{ field.deathday }}
											</span>
										</p>
										<p class="text-left text-base font-medium whitespace-pre-wrap">
											{{ field.value }}
										</p>
									</div>
								</div>
							</section>

							<!-- Biography -->
							<section class="relative flex w-full flex-col items-start justify-start gap-2">
								<h2 class="flex-shrink-0 flex-grow-0 text-xs font-bold uppercase text-surface-11">
									{{ $t("Biography") }}
								</h2>
								<p
									v-if="data?.biography"
									class="self-stretch whitespace-pre-line text-base font-medium leading-[173%]"
								>
									{{ breakDescription(data?.biography ?? '') }}
								</p>
							</section>

							<!-- Known For Carousel -->
							<div class="mb-8 -ml-6 w-[101.5%]">
								<MediaCarousel
									v-if="data?.known_for && data?.known_for?.length > 0"
									:color-palette="data?.color_palette"
									:data="unique(data.known_for, 'id')"
									:disable-auto-aspect="true"
									:limit-card-count-by="2"
									title="Known for"
									type="poster"
								/>
							</div>

							<!-- Credit Groups -->
							<CreditGroup :items="data?.[`${filter}_credits`]?.cast" title="Acting" />
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
						</section>

						<FloatingPersonCard :data="data" />
					</div>
				</article>
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>

<style scoped>
ion-content::part(background) {
	background: transparent;
}
</style>
