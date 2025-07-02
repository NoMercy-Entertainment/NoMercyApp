<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';

import { useDownloadManager } from '@/lib/OfflineContentManager/useDownloadManager';
import { tmdbImageBaseUrl } from '@/config/config';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

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
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout :grid-style="3" title="Profile">
				<div class="flex flex-col gap-2 p-4 overflow-clip col-span-12">
					<h2 class="text-lg mb-2">
						Download for Offline Viewing
					</h2>

					<div class="flex gap-4 max-h-[80vh] overflow-clip">
						<div class="w-2/5">
							<InputText v-model="input" class="w-full text-sm" />
							<button
								:disabled="isDownloading"
								class="bg-primary p-1.5 rounded disabled:opacity-50 mt-2 w-full text-sm"
								@click="downloadShow"
							>
								{{ isDownloading ? "Downloading..." : "Download Show" }}
							</button>

							<div v-if="isDownloading || completedItems" class="mt-2 text-xs">
								<div class="flex justify-between items-center mb-1">
									<span>Progress: {{ progress }}% ({{ completedItems }}/{{
										totalItems
									}})</span>
									<button
										class="text-xs px-2 py-0.5 rounded bg-neutral-800"
										@click="isPaused ? resumeDownloads() : pauseDownloads()"
									>
										{{ isPaused ? "Resume All" : "Pause All" }}
									</button>
								</div>
								<div class="w-full bg-neutral-700 rounded h-1.5 mt-1">
									<div
										class="bg-primary h-full rounded"
										:style="`width: ${progress}%`"
									/>
								</div>
							</div>
						</div>

						<div
							v-if="downloadQueue.length"
							class="flex-1 overflow-y-auto available"
						>
							<div class="grid gap-2">
								<div
									v-for="item in downloadQueue"
									:key="item.id"
									class="bg-neutral-900/50 rounded p-4 flex flex-col gap-2"
								>
									<div class="flex justify-between items-center">
										<div
											class="text-sm font-medium truncate flex items-center gap-2"
										>
											{{ item.title }}
											<span
												v-if="item.status === 'downloading'"
												class="text-2xs text-neutral-400"
											>(Downloading...)</span>
											<span
												v-else-if="item.status === 'waiting'"
												class="text-2xs text-neutral-400"
											>(Waiting...)</span>
										</div>
										<button
											v-if="item.status !== 'completed'"
											class="text-2xs px-2 py-0.5 rounded bg-neutral-800"
											@click="
												item.status === 'downloading'
													|| item.status === 'pending'
													|| item.status === 'waiting'
													? pauseItem(item.id)
													: resumeItem(item.id)
											"
										>
											{{
												item.status === "downloading"
													|| item.status === "pending"
													|| item.status === "waiting"
													? "Pause"
													: "Resume"
											}}
										</button>
									</div>
									<div class="flex gap-2">
										<div class="w-1/4 flex flex-col gap-2">
											<img
												alt="Item Image"
												:src="`${tmdbImageBaseUrl}${item.image}`"
												class="w-full h-auto aspect-video object-fit my-auto rounded"
											>
											<!-- <div class="w-full bg-neutral-700 rounded h-1.5 mt-1">
                      <div class="bg-primary h-full rounded" :style="`width: ${item.progress}%`" />
                    </div> -->
										</div>

										<div class="flex-1 min-w-0">
											<!-- Asset Progress -->
											<div class="grid grid-cols-1 gap-x-4 gap-y-0.5">
												<div
													v-for="asset in item.children"
													:key="asset.type"
													class="text-2xs"
												>
													<div class="flex justify-between leading-0">
														<span>{{ asset.name }}</span>
														<span>{{ asset.progress }}%</span>
													</div>
													<div class="w-full bg-neutral-700 rounded h-1">
														<div
															:class="{
																'bg-blue-500': asset.type === 'video',
																'bg-green-500': asset.type === 'audio',
																'bg-yellow-500': asset.type === 'subtitle',
																'bg-purple-500': asset.type === 'preview',
																'bg-pink-500': asset.type === 'font',
															}"
															class="h-full rounded"
															:style="`width: ${asset.progress}%`"
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
