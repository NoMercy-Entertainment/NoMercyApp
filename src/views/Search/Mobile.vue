<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewDidEnter, onIonViewWillEnter } from '@ionic/vue';
import { useRoute } from 'vue-router';

import { setBackground, setColorPalette } from '@/store/ui';
import {
	fetchNextPage,
	hasMoreResults,
	musicSearchResult,
	search,
	searchType,
	searchValue,
	videoSearchResult,
} from '@/store/search';
import { greetingValue } from '@/config/global';
import { showScreensaver } from '@/store/imageModal';

import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import SearchCard from '@/components/Cards/SearchCard.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();
const content = ref<VueDivElement>();

onIonViewWillEnter(() => {
	searchType.value = route.query.from === 'music' ? 'music' : 'video';
	setColorPalette(null);
	setBackground(null);
	setTimeout(() => {
		search.value.focus();
		// @ts-ignore
		content.value?.$el?.scrollToBottom();
	}, 100);
});

onMounted(() => {
	searchType.value = route.query.from === 'music' ? 'music' : 'video';
	setColorPalette(null);
	setBackground(null);
	setTimeout(() => {
		search.value.focus();
		// @ts-ignore
		content.value?.$el?.scrollToBottom();
	}, 100);
});

onIonViewDidEnter(() => {
	setColorPalette(null);
	setBackground(null);
});

onMounted(() => {
	setTimeout(() => {
		search.value.focus();
		// @ts-ignore
		content.value?.$el?.scrollToBottom();
	}, 100);
});

watch(showScreensaver, (value) => {
	if (value) {
		document.body.focus();
	}
});

watch(searchType, () => {
	setTimeout(() => {
		if (searchValue.value?.length === 0) {
			search.value.focus();
		}
		// @ts-ignore
		content.value?.$el?.scrollToBottom();
	}, 100);
});
</script>

<template>
	<IonPage>
		<IonContent ref="content" :fullscreen="true">
			<div
				class="absolute inset-0 w-screen h-available flex flex-grow flex-col items-center justify-start gap-12 text-surface-12 overflow-clip  will-change-auto"
			>
				<CosmosBg2 v-if="greetingValue && searchValue?.length === 0" />
				<div
					v-if="greetingValue && searchValue?.length === 0"
					class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3"
				>
					<p
						class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left text-surface-12"
					>
						{{ $t(`Good ${greetingValue}`) }}
					</p>
					<p
						class="flex-grow-0 flex-shrink-0 w-[333px] text-2xl text-center text-[#eff7ff]/[0.62]"
					>
						{{
							searchType === "video"
								? $t("What would you like to see?")
								: $t("What would you like to listen to?")
						}}
					</p>
				</div>

				<div
					class="relative flex w-full h-available flex-col gap-4 overflow-clip mb-14"
				>
					<div
						v-if="searchType === 'video'"
						class="flex flex-wrap gap-2 sm:gap-4 overflow-auto p-4"
					>
						<template v-for="item in videoSearchResult ?? []" :key="item.id">
							<SearchCard :item="item" />
						</template>
						<div
							v-if="hasMoreResults && videoSearchResult.length > 0"
							ref="loadMore"
							class="z-50 mt-4 flex justify-center"
						>
							<button
								class="h-12 rounded bg-blue-500 px-4 py-2"
								@click="fetchNextPage()"
							>
								{{ $t("Load more") }}
							</button>
						</div>
					</div>

					<div
						v-else-if="musicSearchResult"
						class="flex w-full flex-col h-available p-4 sm:pt-0 overflow-auto"
					>
						<component
							:is="render.component"
							v-for="(render, index) in musicSearchResult ?? []"
							:key="render.id"
							:index="index"
							v-bind="render.props"
						/>
					</div>
				</div>

				<div
					id="search-bar"
					class="absolute flex justify-center items-center self-center flex-grow-0 flex-shrink-0 w-available h-14 sm:w-1/2 overflow-hidden gap-2 p-1.5 rounded-[20px] border-2 bg-[#d7dbdf] border-[#eceef0] dark:bg-black dark:border-[#202425] transform-gpu transition-translate duration-200 z-999"
				>
					<div
						class="relative flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 p-1 rounded-xl bg-[#012139]/[0.13] dark:bg-[#dfeffe]/[0.14] backdrop-blur"
					>
						<div
							class="relative flex justify-center items-start flex-grow-0 flex-shrink-0 gap-2"
						>
							<div
								:class="{
									'translate-x-0': searchType === 'video',
									'translate-x-[120%]': searchType === 'music',
								}"
								class="absolute w-9 h-available inset-0 bg-focus z-0 rounded-lg transition-all duration-150"
							/>
							<button
								class="text-surface-12 flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9 h-9"
								@click="searchType = 'video'"
							>
								<MoooomIcon
									class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"
									icon="film"
								/>
							</button>
							<button
								class="text-surface-12 flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9 h-9"
								@click="searchType = 'music'"
							>
								<MoooomIcon
									class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"
									icon="noteDouble"
								/>
							</button>
						</div>
					</div>

					<div class="flex w-0 flex-1">
						<input
							id="search"
							ref="search"
							v-model="searchValue"
							:placeholder="
								searchType === 'video'
									? `${$t('Movie')}, ${$t('Show')} ${$t('or')} ${$t(
										'Person',
									)}...`
									: `${$t('Artist')}, ${$t('Album')} ${$t('or')} ${$t(
										'Track',
									)}...`
							"
							autocomplete="off"
							class="w-available flex-shrink-0 border-transparent bg-transparent px-1 mr-1 text-lg shadow-transparent flex-grow-1 focus:outline-none"
							enterkeyhint="search"
							name="search"
							pattern="[A-Za-z0-9\s]{1,}"
							type="search"
						>
					</div>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<style lang="scss" scoped>
#search-bar {
	translate: 0 -50dvh;
	bottom: var(--keyboard-height, 0px);
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}

html.keyboard-open #search-bar {
	translate: 0 0;
	border-radius: 0;
	margin: 0;
	bottom: 0;
}
html.plt-mobileweb.keyboard-open #search-bar {
	top: 0;
	bottom: unset;
}

ion-content:has(input:not(:placeholder-shown)) #search-bar {
	translate: 0 0;
	bottom: 0;
	margin: 0;
	border-radius: 0;
}
</style>
