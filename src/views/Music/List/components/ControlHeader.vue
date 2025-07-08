<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import audioPlayer from '@/store/audioPlayer';

import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import { isTrackRoute } from '@/store/routeState';
import { isPlatform } from '@ionic/vue';
import ShareButton from '@/components/Buttons/ShareButton.vue';
import type { ShareOptions } from '@capacitor/share';
import { useRoute } from 'vue-router';

const props = defineProps({
	data: {
		type: Object as PropType<DisplayList | undefined> | undefined,
		required: false,
	},
	filter: {
		type: String as PropType<string>,
		required: true,
	},
});

defineEmits(['filter-change']);

const route = useRoute();

function handleAdd() {
	audioPlayer.setQueue(props.data?.tracks ?? []);
}

const shareData = computed<ShareOptions>(() => ({
	title: props.data?.name ?? '',
	url: `https://app.nomercy.tv${route.fullPath}`,
}));
</script>

<template>
	<div
		class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"
	/>
	<div
		class="flex sm:gap-4 items-center py-4 px-4 sm:px-8 w-full pl-3 pr-4 sm:pr-10 h-20 z-40"
		data-index="1"
	>
		<BigPlayButton v-if="data?.tracks" :data="data" class="hidden sm:flex" />

		<div
			class="relative hidden h-fit cursor-pointer items-center justify-center text-auto-12/11 focus-within:text-auto sm:flex mr-auto"
		>
			<input
				id="search"
				:value="filter"
				class="bg-transparent border-auto-12/5 border-2 rounded-md focus-visible:!border-auto-12/9 focus-visible:text-current placeholder-current p-2"
				placeholder="Filter…"
				type="text"
				name="search"
				@input="
					$emit('filterChange', ($event.target as HTMLInputElement)?.value)
				"
			>
			<div
				class="absolute top-2 right-2 bottom-2 flex items-center justify-center"
			>
				<OptimizedIcon icon="searchMagnifyingGlass" class="!w-7" />
			</div>
		</div>

		<ShareButton
			:share-data="shareData"
			class="!p-0 text-white hidden sm:flex sm:ml-auto"
		/>
		<MediaLikeButton
			:data="data"
			color="var(--color-focus)"
			class-name="!w-8 !h-8"
		/>

		<ShareButton class="!p-0 text-white sm:hidden" />

		<MusicButton
			v-if="isTrackRoute"
			id="add"
			:onclick="handleAdd"
			class=""
			label="add"
		>
			<OptimizedIcon icon="add" class="!w-7" />
		</MusicButton>
		<!--        <ListControlHeaderMoreMenuButton v-if="!isTrackRoute" :items="[]"/> -->
	</div>

	<div
		class="sm:hidden sticky left-full -mt-16 z-1199 flex justify-center items-center gap-2 mr-4 h-auto"
		style="box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05)"
		:class="{
			'top-11': !isPlatform('capacitor'),
			'top-10': isPlatform('capacitor'),
		}"
	>
		<BigPlayButton v-if="data?.tracks" :data="data" />
	</div>
</template>
