<script lang="ts" setup>
import type { PropType } from 'vue';

import { parseYear } from '@/lib/dateTime';

import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	item: {
		type: Object as PropType<{
			id: number;
			media_type: string;
			title?: string;
			name?: string;
			release_date?: string;
			first_air_date?: string;
			overview?: string;
			backdrop_path?: string;
			poster_path?: string;
			profile_path?: string;
		}>,
		required: true,
	},
});
</script>

<template>
	<RouterLink
		:to="`/${item.media_type}/${item.id}`"
		class="relative flex w-full gap-4 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2"
	>
		<img
			v-if="item?.backdrop_path"
			:alt="item?.title"
			:src="`https://image.tmdb.org/t/p/original${item?.backdrop_path}`"
			class="absolute inset-0 h-full w-full object-cover"
		>

		<div
			class="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-white via-white/60 to-white/40 dark:from-black dark:via-black/75 dark:to-black/40 from-25%"
		/>

		<div
			class="relative z-20 h-auto w-1/4 overflow-hidden rounded-sm aspect-poster sm:w-1/4"
		>
			<img
				v-if="item?.poster_path || item?.profile_path"
				:alt="item?.title"
				:src="
					`https://image.tmdb.org/t/p/original${
						item?.poster_path ?? item?.profile_path}`
				"
				class="absolute inset-0 h-auto w-full object-cover"
			>
			<AppLogoSquare
				v-else
				class="absolute inset-0 top-2 z-20 m-auto h-16 w-16"
			/>
		</div>

		<div
			class="relative z-20 flex h-full w-px flex-1 flex-col items-start justify-start gap-1"
		>
			<p
				class="flex-shrink-0 flex-grow-0 self-stretch text-left text-xl font-semibold line-clamp-1"
			>
				{{ item?.name || item?.title }}
			</p>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch"
			>
				<p
					class="flex flex-shrink-0 flex-grow-0 items-center gap-2 text-right text-base"
				>
					<MoooomIcon
						v-if="item?.media_type === 'tv'"
						class-name="h-5 w-5 sm:h-4 sm:w-4"
						icon="monitor"
					/>
					<MoooomIcon
						v-else-if="item?.media_type === 'movie'"
						class-name="h-5 w-5 sm:h-4 sm:w-4"
						icon="film"
					/>
					<MoooomIcon
						v-else-if="item?.media_type === 'person'"
						class-name="h-5 w-5 sm:h-4 sm:w-4"
						icon="user"
					/>
					<span
						v-if="item?.release_date || item?.first_air_date"
						class="sm:text-2xs"
					>
						({{ parseYear(item?.release_date ?? item?.first_air_date) }})
					</span>
				</p>
			</div>
			<p class="text-sm line-clamp-4 sm:text-sm">
				{{ item?.overview }}
			</p>
		</div>
	</RouterLink>
</template>
