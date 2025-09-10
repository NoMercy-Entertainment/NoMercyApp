import { ref } from 'vue';
import type { PlaylistItem as BasePlaylistItem } from '@/lib/VideoPlayer';
import type { Track } from '@nomercy-entertainment/nomercy-video-player/dist/types';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import { user } from '@/store/user';
import { pad } from '@/lib/stringArray';

export interface PlaylistItem extends BasePlaylistItem {
	duration: string;
	favorite: boolean;
	date: string;
	video_id: string;
	tracks: Track[];
}

type MediaType = 'video' | 'music';

interface DownloadItemProgress {
	id: string;
	title: string;
	image: string;
	progress: number;
	status:
		| 'pending'
		| 'downloading'
		| 'completed'
		| 'error'
		| 'paused'
		| 'waiting';
	children: {
		type: 'video' | 'subtitle' | 'preview' | 'font' | 'audio';
		name: string;
		progress: number;
		status:
			| 'pending'
			| 'downloading'
			| 'completed'
			| 'error'
			| 'paused'
			| 'waiting';
	}[];
}

export function useDownloadManager() {
	const isDownloading = ref(false);
	const progress = ref(0);
	const completedItems = ref(0);
	const totalItems = ref(0);
	const itemProgress = ref(0);
	const downloadQueue = ref<DownloadItemProgress[]>([]);
	const isPaused = ref(false);
	let worker: Worker | null = null;

	function updateCompletedItems() {
		completedItems.value = downloadQueue.value.filter(
			item => item.status === 'completed',
		).length;
	}

	function pauseDownloads() {
		if (!isPaused.value) {
			worker?.postMessage({ controls: { type: 'pause' } });
			// Only update non-completed items
			downloadQueue.value.forEach((item) => {
				if (item.status !== 'completed') {
					item.status = 'paused';
					item.children.forEach((child) => {
						if (child.status !== 'completed') {
							child.status = 'paused';
						}
					});
				}
			});
			isPaused.value = true;
		}
	}

	function resumeDownloads() {
		if (isPaused.value) {
			// Only find items that are currently paused (not completed)
			const pausedItems = downloadQueue.value.filter(
				item => item.status === 'paused',
			);
			if (pausedItems.length > 0) {
				// Mark first item as pending, rest as waiting
				pausedItems[0].status = 'pending';
				pausedItems[0].children.forEach((child) => {
					if (child.status === 'paused')
						child.status = 'pending';
				});

				// Mark rest as waiting
				pausedItems.slice(1).forEach((item) => {
					item.status = 'waiting';
					item.children.forEach((child) => {
						if (child.status === 'paused')
							child.status = 'waiting';
					});
				});

				worker?.postMessage({
					controls: {
						type: 'resume',
						pausedIds: pausedItems.map(item => item.id),
					},
				});
			}
			isPaused.value = false;
		}
	}

	function pauseItem(itemId: string) {
		const item = downloadQueue.value.find(i => i.id === itemId);
		if (
			item
			&& (item.status === 'downloading'
				|| item.status === 'pending'
				|| item.status === 'waiting')
		) {
			worker?.postMessage({ controls: { type: 'pauseItem', itemId } });
			// Update UI immediately for better responsiveness
			item.status = 'paused';
			item.children.forEach((child) => {
				if (
					child.status === 'downloading'
					|| child.status === 'pending'
					|| child.status === 'waiting'
				) {
					child.status = 'paused';
				}
			});

			// Check if all non-completed items are now paused
			const allPaused = downloadQueue.value.every(
				i => i.status === 'completed' || i.status === 'paused',
			);

			if (allPaused) {
				isPaused.value = true;
			}
		}
	}

	function resumeItem(itemId: string) {
		const item = downloadQueue.value.find(i => i.id === itemId);
		if (item && item.status === 'paused') {
			worker?.postMessage({ controls: { type: 'resumeItem', itemId } });
			// Update UI immediately for better responsiveness
			const activeItem = downloadQueue.value.find(
				i => i.status === 'downloading' || i.status === 'pending',
			);
			if (activeItem) {
				item.status = 'waiting';
				item.children.forEach((child) => {
					if (child.status === 'paused') {
						child.status = 'waiting';
					}
				});
			}
			else {
				item.status = 'pending';
				item.children.forEach((child) => {
					if (child.status === 'paused') {
						child.status = 'pending';
					}
				});
			}

			// If any item is now active, clear the global pause state
			const anyActive = downloadQueue.value.some(
				i => i.status === 'downloading' || i.status === 'pending',
			);

			if (anyActive) {
				isPaused.value = false;
			}
		}
	}

	function prioritizeItem(itemId: string) {
		worker?.postMessage({ controls: { action: 'prioritize', itemId } });
	}

	async function downloadPlaylist(type: MediaType, item: string) {
		isDownloading.value = true;

		try {
			const { data: playlist } = await serverClient().get<PlaylistItem[]>(
				`/${item}/watch`,
			);

			// Only reset progress if this is a new query (different playlist)
			const newItems = playlist
				.filter(item => !!item?.file)
				.map(item => item.video_id);

			const currentItems = downloadQueue.value.map(item => item.id);
			const isNewQuery
				= newItems.some(id => !currentItems.includes(id))
					|| currentItems.some(id => !newItems.includes(id));

			if (isNewQuery) {
				// Reset everything for a new query
				progress.value = 0;
				completedItems.value = 0;
				downloadQueue.value = [];
			}
			else {
				// Keep existing progress, only update non-completed items
				downloadQueue.value = downloadQueue.value.filter(
					item => item.status === 'completed',
				);
			}

			// Initialize download queue with new/remaining items
			downloadQueue.value = await Promise.all(
				playlist
					.filter(item => !!item?.file)
					.map(async (episode, index) => {
						// Check which assets actually exist
						const hasSubtitles = episode.tracks?.some(
							t => t.kind === 'subtitles' && t.file,
						);
						const hasFonts = episode.tracks?.some(
							t => t.kind === 'fonts' && t.file,
						);
						const hasPreviews = episode.tracks?.some(
							t => ['thumbnails', 'sprite'].includes(t.kind) && t.file,
						);

						// Check master playlist for audio tracks only if it's an HLS stream
						let hasAudio = false;
						if (episode.file.endsWith('.m3u8')) {
							try {
								const response = await fetch(
									`${currentServer.value?.serverBaseUrl}${episode.file}`,
									{
										headers: {
											Authorization: `Bearer ${user.value?.accessToken}`,
										},
									},
								);
								const masterPlaylist = await response.text();
								hasAudio = masterPlaylist.includes('#EXT-X-MEDIA:TYPE=AUDIO');
							}
							catch (error) {
								console.warn(
									'Failed to check master playlist for audio:',
									error,
								);
							}
						}

						const children = [
							// Video track is always present if we got here (due to filter)
							{ type: 'video', name: 'Video', progress: 0, status: 'pending' },
						] as DownloadItemProgress['children'];

						// Only add asset types that exist
						if (hasAudio) {
							children.push({
								type: 'audio',
								name: 'Audio',
								progress: 0,
								status: 'pending',
							});
						}
						if (hasSubtitles) {
							children.push({
								type: 'subtitle',
								name: 'Subtitles',
								progress: 0,
								status: 'pending',
							});
						}
						if (hasPreviews) {
							children.push({
								type: 'preview',
								name: 'Preview',
								progress: 0,
								status: 'pending',
							});
						}
						if (hasFonts) {
							children.push({
								type: 'font',
								name: 'Fonts',
								progress: 0,
								status: 'pending',
							});
						}

						return {
							id: episode.video_id,
							title: `${episode.show}${
								episode.season ? ` S${pad(episode.season, 2)}` : ''
							}${episode.episode ? `E${pad(episode.episode, 2)}` : ''} - ${
								episode.title
							}`,
							image: episode.image,
							progress: 0,
							status: index === 0 ? 'pending' : 'waiting',
							children: children.map(child => ({
								...child,
								status: index === 0 ? 'pending' : 'waiting',
							})),
						};
					}),
			);

			const tasks = playlist
				.filter(item => !!item?.file)
				.map((episode) => {
					const subtitlePaths = episode.tracks
						?.filter(t => t.kind === 'subtitles' && t.file)
						?.map(t => t.file);
					const fontPaths = episode.tracks
						?.filter(t => t.kind === 'fonts' && t.file)
						?.map(t => t.file);
					const previewPaths = episode.tracks
						?.filter(t => ['thumbnails', 'sprite'].includes(t.kind) && t.file)
						?.map(t => t.file);

					return {
						mediaId: episode.video_id,
						mediaType: 'video' as MediaType,
						mediaPath: episode.file,
						baseUrl: currentServer.value?.serverBaseUrl || '',
						token: user.value?.accessToken || '',
						// Only include paths arrays if they have content
						...(subtitlePaths?.length ? { subtitlePaths } : {}),
						...(fontPaths?.length ? { fontPaths } : {}),
						...(previewPaths?.length ? { previewPaths } : {}),
					};
				});

			if (!tasks.length) {
				throw new Error('No valid files to download');
			}

			totalItems.value = tasks.length;
			console.log('Starting download with tasks:', tasks);

			await new Promise((resolve, reject) => {
				worker = new Worker(new URL('./downloadWorker', import.meta.url), {
					type: 'module',
				});

				worker.onerror = (err) => {
					console.error('Worker error:', err);
					reject(err);
				};

				worker.onmessage = (e) => {
					console.log('Worker message:', e.data);
					// Handle paused error message specifically
					if (e.data.type === 'error' && e.data.error === 'paused') {
						// Don't treat pause messages as errors
						return;
					}

					const {
						type: msgType,
						progress: overallProgress,
						itemProgress: itemProg,
						assetType,
						assetProgress,
						itemId,
						status,
						isNewQuery: workerNewQuery,
					} = e.data;

					if (msgType === 'progress') {
						// Only update progress if this isn't a new query or if it is a new query
						if (isNewQuery || !workerNewQuery) {
							progress.value = Math.min(overallProgress, 100);
						}
						itemProgress.value = itemProg;

						// Update specific item and asset progress
						if (itemId) {
							const item = downloadQueue.value.find(i => i.id === itemId);
							if (item) {
								// Update specific asset progress
								if (assetType) {
									const asset = item.children.find(c => c.type === assetType);
									if (asset) {
										asset.progress = Math.min(assetProgress, 100);
										asset.status
											= asset.progress === 100 ? 'completed' : status;
									}
								}

								// Update overall item progress
								const completedAssets = item.children.filter(
									c => c.progress === 100,
								).length;
								item.progress = Math.round(
									(completedAssets / item.children.length) * 100,
								);
								if (item.progress === 100) {
									item.status = 'completed';
									updateCompletedItems(); // Update completed items count
								}
								else if (status) {
									item.status = status;
								}
							}
						}
					}
					else if (msgType === 'complete') {
						updateCompletedItems(); // Ensure completed items count is updated
						resolve(true);
					}
					else if (msgType === 'error') {
						if (e.data.error === 'paused') {
							// Don't treat pause as an error, just resolve with false
							resolve(false);
						}
						else {
							reject(e.data.error);
						}
					}
					else if (msgType === 'status') {
						const item = downloadQueue.value.find(
							i => i.id === e.data.itemId,
						);
						if (item && item.status !== 'completed') {
							// Don't update completed items
							if (item.status !== e.data.status) {
								item.status = e.data.status;
								item.children.forEach((child) => {
									if (child.status !== 'completed') {
										child.status = e.data.status;
									}
								});
							}
						}
					}
				};

				worker.postMessage({
					tasks,
					baseUrl: currentServer.value?.serverBaseUrl,
					token: user.value?.accessToken,
					isNewQuery,
				});
			});

			return true; // Successfully completed downloads
		}
		catch (error) {
			if (error === 'paused') {
				console.log('Downloads paused');
				return false; // Paused state is not an error
			}
			console.error('Download failed:', error);
			return false;
		}
		finally {
			if (!isPaused.value) {
				// Only cleanup if not paused
				worker?.terminate();
				isDownloading.value = false;
			}
		}
	}

	return {
		isDownloading,
		progress,
		totalItems,
		completedItems,
		itemProgress,
		downloadQueue,
		isPaused,
		downloadPlaylist,
		pauseDownloads,
		resumeDownloads,
		pauseItem,
		resumeItem,
		prioritizeItem,
	};
}
