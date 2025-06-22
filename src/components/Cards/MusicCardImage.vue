<script setup lang="ts">
import type { PropType } from 'vue';

import type { HomeDataItem } from '@/types/api/music';
import type { MusicCardPageResponseData } from '@/types/api/music/musicPlayer';
import type { Album } from '@/types/api/music/album';
import FavoriteImage from '@/components/Images/FavoriteImage.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';

defineProps({
	data: {
		type: Object as
		| PropType<HomeDataItem | MusicCardPageResponseData | Album>
		| undefined,
		required: true,
	},
});
</script>

<template>
	<template v-if="data?.type === 'albums' || data?.type === 'release_groups'">
		<div
			class="frosting relative z-0 flex aspect-square h-auto w-full flex-col items-start justify-start self-stretch overflow-clip group-hover/musicCard:rounded-md rounded-lg bg-cover bg-center bg-no-repeat transition-all duration-200 bg-auto-2/7"
		>
			<div
				class="absolute -inset-0.5 z-10 !rounded-xl group-hover/musicCard:rounded-lg group-hover/musicCard:border-0 border-8 transition-all duration-200 border-auto-2/9"
			/>

			<div class="backdropCard-overlay" />
			<FavoriteImage v-if="data?.id === 'favorite'" class="" />
			<CoverImage
				v-else
				:data="data"
				:size="180"
				class-name="absolute top-1/2 left-1/2 z-0 h-full -translate-x-1/2 -translate-y-1/2 overflow-clip rounded-lg transition-all duration-200"
				type="image"
			/>
		</div>
	</template>

	<template v-else-if="data?.type === 'artists'">
		<div
			class="relative flex aspect-square h-auto w-full items-center justify-end gap-2 self-stretch overflow-clip rounded-2xl group-hover/musicCard:p-1 p-1.5 transition-all duration-200 bg-auto-3/7"
		>
			<div class="backdropCard-overlay !rounded-2xl absolute inset-0" />
			<FavoriteImage v-if="data?.id === 'favorite'" class="" />
			<CoverImage
				v-else
				:data="data"
				:size="180"
				class-name="frosting absolute top-1/2 left-1/2 h-full w-available -translate-x-1/2 -translate-y-1/2 group-hover/musicCard:rounded-xl transition-all duration-200 rounded-[0.65rem]"
				type="image"
			/>
		</div>
	</template>

	<template v-else-if="data?.type === 'playlists'">
		<div
			class="frosting absolute -top-1 group-hover/musicCard:-top-3 left-1/2 flex aspect-square h-auto -translate-x-1/2 flex-col items-start justify-start rounded-lg opacity-60 transition-all delay-150 duration-200 w-[75%] bg-focus/10"
		>
			<div class="flex h-full items-start justify-start self-stretch">
				<div class="relative flex items-center justify-start self-stretch">
					<div class="" />
					<div class="" />
				</div>
			</div>
		</div>

		<div
			class="absolute left-1/2 flex aspect-square h-auto -translate-x-1/2 flex-col items-start justify-start rounded-xl opacity-80 transition-all delay-75 duration-200 w-[85%] -top-0.5 group-hover/musicCard:-top-1.5 bg-focus/10"
		>
			<div class="flex h-full items-start justify-start self-stretch">
				<div class="relative flex items-center justify-start self-stretch">
					<div class="" />
					<div class="" />
				</div>
			</div>
		</div>

		<div
			class="relative flex aspect-square h-auto w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip rounded-2xl bg-cover bg-center bg-no-repeat bg-auto-7"
		>
			<div class="backdropCard-overlay !rounded-2xl" />
			<FavoriteImage v-if="data?.id === 'favorite'" class="" />
			<CoverImage
				v-else
				:data="data"
				:size="180"
				class-name="h-full"
				type="image"
			/>
		</div>
	</template>
</template>
