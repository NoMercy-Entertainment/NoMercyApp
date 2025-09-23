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
		class="pointer-events-none absolute z-0 h-96 w-full"
	/>
	<div
		class="flex sm:gap-4 items-center py-4 px-4 sm:px-8 w-full pl-3 pr-4 sm:pr-10 h-20 z-40"
		data-index="1"
	>
		<BigPlayButton v-if="data?.tracks" :data="data" class="hidden sm:flex" />

		<div
			class="relative hidden h-fit cursor-pointer items-center justify-center focus-within:text-surface sm:flex mr-auto"
		>
			<input
				id="search"
				:value="filter"
				class="bg-transparent border-surface-12/5 border-2 rounded-md focus-visible:!border-surface-12/9 focus-visible:text-current placeholder-current p-2"
				name="search"
				placeholder="Filter…"
				type="text"
				@input="
					$emit('filterChange', ($event.target as HTMLInputElement)?.value)
				"
			>
			<div
				class="absolute top-2 right-2 bottom-2 flex items-center justify-center"
			>
				<OptimizedIcon class="!w-7" icon="searchMagnifyingGlass" />
			</div>
		</div>

		<ShareButton
			:share-data="shareData"
			class="!p-0 hidden sm:flex sm:ml-auto"
		/>
		<MediaLikeButton
			:data="data"
			class-name="!w-8 !h-8"
			color="var(--color-theme-8)"
		/>

		<ShareButton class="!p-0 sm:hidden" />

		<MusicButton
			v-if="isTrackRoute"
			id="add"
			:onclick="handleAdd"
			class=""
			label="Add"
		>
			<OptimizedIcon class="!w-7" icon="add" />
		</MusicButton>
		<!--        <ListControlHeaderMoreMenuButton v-if="!isTrackRoute" :items="[]"/> -->
	</div>

	<div
		:class="{
			'top-11': !isPlatform('capacitor'),
			'top-10': isPlatform('capacitor'),
		}"
		class="sm:hidden sticky left-full -mt-16 z-1199 flex justify-center items-center gap-2 mr-4 h-auto"
		style="box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05)"
	>
		<BigPlayButton v-if="data?.tracks" :data="data" />
	</div>
</template>
