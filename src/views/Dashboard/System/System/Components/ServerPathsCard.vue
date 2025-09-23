<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { MoooomIcons } from '@Icons/icons';
import MeterGroup from 'primevue/metergroup';

import useServerClient from '@/lib/clients/useServerClient';

import SystemCard from './ServerSystemCard.vue';
import { blue, green, orange, purple } from '@/config/global';
import { hexOpacity } from '@/lib/colorHelper';
import { dashboardSocketIsConnected } from '@/lib/clients/dashboardSocket';

// const {data: paths} = useServerClient<SystemPath[]>({
//   path: 'dashboard/server/paths',
//   queryKey: ['serverpaths', currentServer.value?.serverBaseUrl],
// });

interface StorageItem {
	path: string;
	data: {
		movies: number;
		shows: number;
		music: number;
		other: number;
		free: number;
		used: number;
	};
}

const { data: storage } = useServerClient<StorageItem[]>({
	path: 'dashboard/server/storage',
	refetchInterval: 10000,
});

const drives = ref<Drive[]>([]);

interface Drive {
	name: string;
	data: {
		label: string;
		color: string;
		value: number;
		icon: `mooooom-${keyof typeof MoooomIcons}`;
	}[];
}

watch(storage, (value) => {
	if (!value)
		return;

	drives.value = value
		.map((l) => {
			const { movies, shows, music, other, free } = l.data;
			return {
				name: l.path,
				data: [
					{
						label: 'Movies',
						color: hexOpacity(green, 50),
						value: movies,
						icon: 'mooooom-movie',
					},
					{
						label: 'TV Shows',
						color: hexOpacity(orange, 50),
						value: shows,
						icon: 'mooooom-tv',
					},
					{
						label: 'Music',
						color: hexOpacity(purple, 50),
						value: music,
						icon: 'mooooom-music',
					},
					{
						label: 'Other',
						color: hexOpacity(blue, 50),
						value: other,
						icon: 'mooooom-folder',
					},
					// {label: 'Free', color: hexOpacity(gray, 1), value: free ?? 1, icon: 'mooooom-folder'}
				].filter(d => d.value > 0),
			} as Drive;
		})
		.sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(() => {
	if (!storage.value)
		return;

	drives.value = storage.value
		.map((l) => {
			const { movies, shows, music, other, free } = l.data;
			return {
				name: l.path,
				data: [
					{
						label: 'Movies',
						color: hexOpacity(green, 50),
						value: movies,
						icon: 'mooooom-movie',
					},
					{
						label: 'TV Shows',
						color: hexOpacity(orange, 50),
						value: shows,
						icon: 'mooooom-tv',
					},
					{
						label: 'Music',
						color: hexOpacity(purple, 50),
						value: music,
						icon: 'mooooom-music',
					},
					{
						label: 'Other',
						color: hexOpacity(blue, 50),
						value: other,
						icon: 'mooooom-folder',
					},
					// {label: 'Free', color: hexOpacity(gray, 1), value: free ?? 1, icon: 'mooooom-folder'}
				].filter(d => d.value > 0),
			} as Drive;
		})
		.sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<template>
	<SystemCard v-if="dashboardSocketIsConnected" title="Storage">
		<!--    <template v-for="path in paths" :key="path.key"> -->
		<!--      <div -->
		<!--          class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip w-available" -->
		<!--      > -->
		<!--        <p -->
		<!--            class="self-stretch text-sm font-semibold  text-slate-11 dark:text-slate-11 whitespace-nowrap" -->
		<!--        > -->
		<!--          {{ path.key }}: -->
		<!--        </p> -->
		<!--        <p class="flex-shrink-0 flex-grow-0 self-stretch text-sm text-surface-10 line-clamp-1"> -->
		<!--          {{ path.value }} -->
		<!--        </p> -->
		<!--      </div> -->
		<!--    </template> -->

		<div
			v-for="drive in drives"
			:key="drive.name"
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip w-available text-slate-12/80 dark:text-slate-12/70"
		>
			<p class="self-stretch text-sm font-semibold whitespace-nowrap">
				{{ drive.name }}
			</p>
			<MeterGroup
				:max="100"
				:value="drive.data"
				class="flex-shrink-0 flex-grow-0 self-stretch text-xs line-clamp-1 mt-2 children:first:children:bg-surface-2 dark:children:first:children:bg-surface-1"
			/>
		</div>
	</SystemCard>
</template>
