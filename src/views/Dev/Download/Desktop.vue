<script lang="ts" setup>
import { ref } from 'vue';

import { useDownloadManager } from '@/lib/OfflineContentManager/useDownloadManager';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DownloadQueueItem from './components/DownloadQueueItem.vue';

const {
	isDownloading,
	progress,
	totalItems,
	completedItems,
	downloadQueue,
	isPaused,
	downloadPlaylist,
	pauseDownloads,
	resumeDownloads,
	pauseItem,
	resumeItem,
} = useDownloadManager();

const input = ref('tv/138357');

async function downloadShow() {
	await downloadPlaylist('video', input.value);
}
</script>

<template>
			<DashboardLayout :grid-style="3" title="Profile" class="grid gap-2 p-4 col-span-12">
				<h2 class="text-lg mb-2">
					Download for Offline Viewing
				</h2>

				<div class="flex gap-4 max-h-[80vh] overflow-clip">
					<form class="w-2/5 flex flex-col gap-2" @submit.prevent="downloadShow">
						<InputText v-model="input" class="w-full text-sm" />
						<button
							:disabled="isDownloading"
							class="bg-primary p-1.5 rounded disabled:opacity-50 text-sm"
							type="submit"
						>
							{{ isDownloading ? "Downloading..." : "Download Show" }}
						</button>

						<div v-if="isDownloading || completedItems" class="text-xs grid gap-1">
							<div class="flex justify-between items-center">
								<span>Progress: {{ progress }}% ({{ completedItems }}/{{ totalItems }})</span>
								<button
									class="text-xs px-2 py-0.5 rounded bg-surface-800"
									type="button"
									@click="isPaused ? resumeDownloads() : pauseDownloads()"
								>
									{{ isPaused ? "Resume All" : "Pause All" }}
								</button>
							</div>
							<div class="w-full bg-surface-700 rounded h-1.5 relative">
								<div
									:style="`width: ${progress}%`"
									class="bg-primary h-full rounded absolute inset-0"
								/>
							</div>
						</div>
					</form>

					<div
						v-if="downloadQueue.length"
						class="flex-1 overflow-y-auto available grid gap-2 content-start"
					>
						<DownloadQueueItem
							v-for="item in downloadQueue"
							:key="item.id"
							:item="item"
							:on-pause="pauseItem"
							:on-resume="resumeItem"
						/>
					</div>
				</div>
			</DashboardLayout>
</template>
