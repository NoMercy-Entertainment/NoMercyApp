<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { ShareOptions } from '@capacitor/share';

import type { LibraryResponse } from '@/types/api/base/library';
import type { InfoResponse } from '@/types/api/base/info';
import type { ContinueWatching, HomeItem } from '@/types/api/base/home';
import type { Collection, CollectionResponse } from '@/types/api/base/collection';
import type { PlaylistItem } from '@/types/musicPlayer';

import { isNative } from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';

import CardShadow from '@/components/Cards/CardShadow.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import { poster } from '@/store/ui';
import ShareButton from '@/components/Buttons/ShareButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<
			| LibraryResponse
			| InfoResponse
			| HomeItem
			| ContinueWatching
			| Collection
			| PlaylistItem
			| CollectionResponse
			| undefined
		>,
		required: false,
	},
	trailerState: {
		required: false,
	},
	toggleTrailer: {
		type: Function as PropType<() => void>,
		required: false,
	},
});

const route = useRoute();

const { data: hasItem } = useServerClient<{
	available: boolean;
	server: string;
}>({
	path: `${route?.fullPath}/available`,
});

const playbackStatus = computed(() => {
	if (hasItem.value?.available) {
		return 'Watch';
	}
	if (!props.data) {
		return 'Loading';
	}
	return 'Unavailable';
});

const title = computed(() => {
	// @ts-ignore
	return props.data?.title ?? props.data?.name;
});

const shareData = computed<ShareOptions>(() => ({
	url: `https://app.nomercy.tv${route.fullPath}`,
}));
</script>

<template>
	<div
		v-if="data?.poster || poster"
		:class="{
			'top-safe-offset-8': isNative,
			'top-12': !isNative,
		}"
		class="frosting flex-grow-0 flex-shrink-0 w-[280px] h-[420px] z-10 absolute left-1/2 -translate-x-1/2 overflow-clip rounded-2xl"
	>
		<div
			class="flex flex-col justify-start items-start w-[280px] absolute left-0 top-0 bg-cover bg-no-repeat bg-center"
		>
			<TMDBImage
				:key="poster ?? 'poster'"
				:auto-shadow="true"
				:color-palette="data?.color_palette?.poster"
				:path="data?.poster ?? poster"
				:size="760"
				:title="title"
				aspect="poster"
				class="m-auto children:w-full scale-100 max-h-available 5xl:w-inherit"
				class-name="pointer-events-none absolute -inset-1 z-20 flex h-auto scale-100 select-none items-center place-self-start overflow-hidden w-available h-available max-h-available"
				loading="eager"
				priority="high"
				type="image"
			/>
		</div>

		<CardShadow :colored="true" />

		<div
			class="flex justify-start items-start w-[280px] absolute left-0 top-[348px] gap-4 p-4 z-40"
		>
			<RouterLink
				:class="{ 'opacity-70': !hasItem?.available }"
				:disabled="!hasItem?.available"
				:to="`${data?.link}/watch`"
				class="frosting flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-3xl bg-white/80"
			>
				<p
					class="flex-grow w-[100px] text-[15px] font-semibold text-center text-[#151718]"
				>
					{{ $t(playbackStatus) }}
				</p>
			</RouterLink>

			<button
				v-if="trailerState === true"
				class="frosting flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-3xl text-surface-12 bg-black/80"
				title="Watch trailer"
				@click="toggleTrailer"
			>
				<p class="flex-grow w-[100px] text-[15px] font-semibold text-center">
					{{ $t("Watch trailer") }}
				</p>
			</button>

			<button
				v-else-if="trailerState === false"
				class="frosting flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-3xl text-surface-12 bg-black/80"
				disabled
				title="Trailer unavailable"
			>
				<p class="flex-grow w-[100px] text-[15px] font-semibold text-center text-red-8">
					{{ $t("Watch trailer") }}
				</p>
			</button>

			<button
				v-else-if="trailerState === 'loading'"
				class="frosting flex justify-start items-center flex-grow h-10 relative overflow-hidden gap-2 px-2 py-4 rounded-3xl text-surface-12 bg-black/80"
				disabled
				title="Loading trailer..."
			>
				<p class="flex-grow w-[100px] text-[15px] font-semibold text-center text-gray-8">
					{{ $t("Watch trailer") }}
				</p>
			</button>
		</div>

		<div
			class="flex justify-end items-start w-[280px] absolute left-0 top-0 gap-2 p-4 text-surface-12"
		>
			<div
				class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 p-2 rounded-3xl bg-black/[0.48] border border-black/2 w-10 h-10"
			>
				<MoooomIcon class-name="w-6" icon="check" />
			</div>
			<div
				class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 rounded-3xl bg-black/[0.48] border border-black/2"
			>
				<MediaLikeButton :data="data" class="!p-0" />
			</div>
			<div
				class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 rounded-3xl bg-black/[0.48] border border-black/2"
			>
				<ShareButton :share-data="shareData" class="!p-0" />
			</div>
		</div>
	</div>
</template>

<style scoped></style>
