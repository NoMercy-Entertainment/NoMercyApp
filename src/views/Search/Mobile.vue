<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
	IonContent,
	IonPage,
	isPlatform,
	onIonViewWillEnter,
	useKeyboard,
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { refDebounced } from '@vueuse/core';

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
import { greetingValue, isNative } from '@/config/global';
import { showScreensaver } from '@/store/imageModal';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import SearchCard from '@/components/Cards/SearchCard.vue';

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

const { isOpen, keyboardHeight } = useKeyboard();
const debouncedIsOpen = refDebounced(isOpen, 300);
const debouncedKeyboardHeight = refDebounced(keyboardHeight, 300);

onIonViewWillEnter(() => {
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

watch(debouncedKeyboardHeight, () => {
	setTimeout(() => {
		// @ts-ignore
		content.value?.$el?.scrollToBottom(0);
	}, 100);
});
</script>

<template>
	<IonPage>
		<IonContent ref="content" :fullscreen="true">
			<div
				class="relative flex flex-grow flex-col items-center justify-start gap-12 self-stretch overflow-clip px-4 pt-8 will-change-auto" :class="{
					'mb-24': debouncedIsOpen && searchValue?.length === 0,
				}"
			>
				<CosmosBg2 v-if="greetingValue && searchValue?.length === 0" />
				<div
					v-if="greetingValue && searchValue?.length === 0"
					class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3"
				>
					<p
						class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left text-slate-light-11 dark:text-slate-dark-11"
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
					class="absolute top-0 flex w-full flex-col gap-4 px-2 pt-2 h-full overflow-clip"
					:style="{
						height:
							debouncedIsOpen && searchValue?.length === 0
								? `calc(100vh - ${debouncedKeyboardHeight + 104}px)`
								: debouncedIsOpen && searchValue?.length > 0
									? `calc(100vh - ${debouncedKeyboardHeight + 70}px)`
									: '92%',
					}"
					:class="searchValue?.length > 0 ? '' : ''"
				>
					<div
						v-if="searchType === 'video'"
						class="flex flex-wrap gap-2 sm:gap-4 overflow-auto"
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
								class="h-12 rounded bg-blue-500 px-4 py-2 text-white"
								@click="fetchNextPage()"
							>
								{{ $t("Load more") }}
							</button>
						</div>
					</div>

					<div
						v-else-if="musicSearchResult"
						class="flex w-full flex-col p-1 h-available sm:p-4 sm:pt-0 overflow-auto"
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
					class="absolute flex justify-center items-center self-center flex-grow-0 flex-shrink-0 w-available h-14 sm:w-1/2 overflow-hidden gap-2 p-1.5 rounded-[20px] border-2 bg-[#d7dbdf] border-[#eceef0] dark:bg-black dark:border-[#202425] transition-all duration-200"
					:style="{
						bottom:
							debouncedIsOpen && searchValue.length === 0
								? `${
									debouncedKeyboardHeight - (isPlatform('mobile') ? 180 : 80)
								}px`
								: debouncedIsOpen && searchValue.length > 0
									? `${debouncedKeyboardHeight - 80}px`
									: !debouncedIsOpen && searchValue.length > 0
										? '0vh'
										: '50vh',
					}"
					:class="{
						'mx-2': !debouncedIsOpen && searchValue.length === 0,
						'rounded-none': debouncedIsOpen || searchValue.length > 0,
						'translate-y-[calc(var(--safe-area-inset-top)*-1.5)]':
							debouncedIsOpen && isNative,
					}"
				>
					<div
						class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 p-1 rounded-xl bg-[#012139]/[0.13] dark:bg-[#dfeffe]/[0.14] backdrop-blur"
					>
						<div
							class="relative flex justify-center items-start flex-grow-0 flex-shrink-0 gap-2"
						>
							<div
								class="absolute w-9 h-available inset-0 bg-focus z-0 rounded-lg transition-all duration-150"
								:class="{
									'translate-x-0': searchType === 'video',
									'translate-x-[120%]': searchType === 'music',
								}"
							/>
							<button
								class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9 h-9"
								:class="{
									'text-slate-dark-12': searchType === 'video',
								}"
								@click="searchType = 'video'"
							>
								<OptimizedIcon
									icon="film"
									class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"
								/>
							</button>
							<button
								class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 p-1 rounded-lg w-9 h-9"
								:class="{
									'text-slate-dark-12': searchType === 'music',
								}"
								@click="searchType = 'music'"
							>
								<OptimizedIcon
									icon="noteDouble"
									class="h-6 w-6 flex-grow-0 flex-shrink-0 transition-all duration-150"
								/>
							</button>
						</div>
					</div>

					<label class="flex w-available">
						<input
							id="search"
							ref="search"
							v-model="searchValue"
							enterkeyhint="search"
							:placeholder="
								searchType === 'video'
									? `${$t('Movie')}, ${$t('Show')} ${$t('or')} ${$t(
										'Person',
									)}...`
									: `${$t('Artist')}, ${$t('Album')} ${$t('or')} ${$t(
										'Track',
									)}...`
							"
							class="w-available flex-shrink-0 border-transparent bg-transparent px-1 mr-1 text-lg shadow-transparent flex-grow-1 focus:outline-none"
							:class="{
								'!py-1': !debouncedIsOpen,
							}"
							name="search"
							type="search"
							autocomplete="off"
						>
					</label>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
