<script lang="ts" setup>
import { tmdbImageBaseUrl } from '@/config/config';

const props = defineProps<{
	item: {
		id: string;
		title: string;
		status: string;
		image: string;
		children: Array<{
			type: string;
			name: string;
			progress: number;
		}>;
	};
	onPause: (id: string) => void;
	onResume: (id: string) => void;
}>();

const assetColorClass = (type: string) => ({
	'bg-blue-500': type === 'video',
	'bg-green-500': type === 'audio',
	'bg-yellow-500': type === 'subtitle',
	'bg-purple-500': type === 'preview',
	'bg-pink-500': type === 'font',
});

const isPausable = (status: string) =>
	status === 'downloading' || status === 'pending' || status === 'waiting';
</script>

<template>
	<article class="bg-surface-900/50 rounded p-4 grid gap-2">
		<header class="flex justify-between items-center">
			<h3 class="text-sm font-medium truncate flex items-center gap-2">
				{{ item.title }}
				<span v-if="item.status === 'downloading'" class="text-2xs text-slate-400">(Downloading...)</span>
				<span v-else-if="item.status === 'waiting'" class="text-2xs text-slate-400">(Waiting...)</span>
			</h3>
			<button
				v-if="item.status !== 'completed'"
				class="text-2xs px-2 py-0.5 rounded bg-surface-800"
				@click="isPausable(item.status) ? onPause(item.id) : onResume(item.id)"
			>
				{{ isPausable(item.status) ? "Pause" : "Resume" }}
			</button>
		</header>

		<div class="flex gap-2">
			<img
				:src="`${tmdbImageBaseUrl}${item.image}`"
				alt="Item Image"
				class="w-1/4 h-auto aspect-video object-fit rounded"
			>

			<div class="flex-1 min-w-0 grid gap-x-4 gap-y-0.5">
				<div
					v-for="asset in item.children"
					:key="asset.type"
					class="text-2xs"
				>
					<div class="flex justify-between leading-0">
						<span>{{ asset.name }}</span>
						<span>{{ asset.progress }}%</span>
					</div>
					<div class="w-full bg-surface-700 rounded h-1">
						<div
							:class="assetColorClass(asset.type)"
							:style="`width: ${asset.progress}%`"
							class="h-full rounded"
						/>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>
