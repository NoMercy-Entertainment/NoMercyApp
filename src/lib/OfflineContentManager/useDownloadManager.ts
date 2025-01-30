import { ref } from 'vue';
import { PlaylistItem as BasePlaylistItem } from '@/lib/VideoPlayer';
import {Track} from "@nomercy-entertainment/nomercy-video-player/dist/types";
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
    status: 'pending' | 'downloading' | 'completed' | 'error' | 'paused';
    children: {
        type: 'video' | 'subtitle' | 'preview' | 'font' | 'audio';
        name: string;
        progress: number;
        status: 'pending' | 'downloading' | 'completed' | 'error' | 'paused';
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

    function pauseDownloads() {
        isPaused.value = true;
        // Update all non-completed items to paused state and send individual pause commands
        downloadQueue.value.forEach(item => {
            if (item.status === 'downloading' || item.status === 'pending') {
                item.status = 'paused';
                worker?.postMessage({ controls: { action: 'pauseItem', itemId: item.id } });
            }
        });
    }

    function resumeDownloads() {
        isPaused.value = false;
        // Update all paused items back to pending state
        downloadQueue.value.forEach(item => {
            if (item.status === 'paused') {
                item.status = 'pending';
            }
        });
        worker?.postMessage({ controls: { action: 'resume' } });
    }

    function pauseItem(itemId: string) {
        const item = downloadQueue.value.find(i => i.id === itemId);
        if (item && (item.status === 'downloading' || item.status === 'pending')) {
            item.status = 'paused';
            worker?.postMessage({ controls: { action: 'pauseItem', itemId } });
            
            // Check if all non-completed items are now paused
            const hasActiveDownloads = downloadQueue.value.some(
                i => i.status === 'downloading' || i.status === 'pending'
            );
            if (!hasActiveDownloads) {
                isPaused.value = true;
            }
        }
    }

    function resumeItem(itemId: string) {
        const item = downloadQueue.value.find(i => i.id === itemId);
        if (item && item.status === 'paused') {
            item.status = 'pending';
            worker?.postMessage({ controls: { action: 'resume', itemId } });
            isPaused.value = false;
        }
    }

    function prioritizeItem(itemId: string) {
        worker?.postMessage({ controls: { action: 'prioritize', itemId } });
    }

    async function downloadPlaylist(type: MediaType, item: string) {
        isDownloading.value = true;

        try {
            const { data: playlist } = await serverClient()
                .get<PlaylistItem[]>(`/${item}/watch`);

            // Only reset progress if this is a new query (different playlist)
            const newItems = playlist
                .filter(item => !!item?.file)
                .map(item => item.video_id);
            
            const currentItems = downloadQueue.value.map(item => item.id);
            const isNewQuery = newItems.some(id => !currentItems.includes(id)) || 
                             currentItems.some(id => !newItems.includes(id));

            if (isNewQuery) {
                // Reset everything for a new query
                progress.value = 0;
                completedItems.value = 0;
                downloadQueue.value = [];
            } else {
                // Keep existing progress, only update non-completed items
                downloadQueue.value = downloadQueue.value.filter(item => item.status === 'completed');
            }

            // Initialize download queue with new/remaining items
            downloadQueue.value = await Promise.all(playlist
                .filter(item => !!item?.file)
                .map(async episode => {
                    // Check which assets actually exist
                    const hasSubtitles = episode.tracks?.some(t => t.kind === 'subtitles' && t.file);
                    const hasFonts = episode.tracks?.some(t => t.kind === 'fonts' && t.file);
                    const hasPreviews = episode.tracks?.some(t => ['thumbnails', 'sprite'].includes(t.kind) && t.file);

                    // Check master playlist for audio tracks only if it's an HLS stream
                    let hasAudio = false;
                    if (episode.file.endsWith('.m3u8')) {
                        try {
                            const response = await fetch(`${currentServer.value?.serverBaseUrl}${episode.file}`, {
                                headers: {
                                    'Authorization': `Bearer ${user.value?.accessToken}`
                                }
                            });
                            const masterPlaylist = await response.text();
                            hasAudio = masterPlaylist.includes('#EXT-X-MEDIA:TYPE=AUDIO');
                        } catch (error) {
                            console.warn('Failed to check master playlist for audio:', error);
                        }
                    }

                    const children = [
                        // Video track is always present if we got here (due to filter)
                        { type: 'video', name: 'Video', progress: 0, status: 'pending' },
                    ] as DownloadItemProgress['children'];

                    // Only add asset types that exist
                    if (hasAudio) {
                        children.push({ type: 'audio', name: 'Audio', progress: 0, status: 'pending' });
                    }
                    if (hasSubtitles) {
                        children.push({ type: 'subtitle', name: 'Subtitles', progress: 0, status: 'pending' });
                    }
                    if (hasPreviews) {
                        children.push({ type: 'preview', name: 'Preview', progress: 0, status: 'pending' });
                    }
                    if (hasFonts) {
                        children.push({ type: 'font', name: 'Fonts', progress: 0, status: 'pending' });
                    }

                    return {
                        id: episode.video_id,
                        title: `${episode.show}${episode.season ? ` S${pad(episode.season,2)}` : ''}${episode.episode ? `E${pad(episode.episode,2)}` : ''} - ${episode.title}`,
                        image: episode.image,
                        progress: 0,
                        status: 'pending',
                        children
                    };
                }));

            const tasks = playlist
                .filter(item => !!item?.file)
                .map(episode => {
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
                        ...(previewPaths?.length ? { previewPaths } : {})
                    };
                });

            if (!tasks.length) {
                throw new Error('No valid files to download');
            }

            totalItems.value = tasks.length;
            console.log('Starting download with tasks:', tasks);
            
            await new Promise((resolve, reject) => {
                worker = new Worker(
                    new URL('./downloadWorker', import.meta.url),
                    { type: 'module' }
                );

                worker.onerror = (err) => {
                    console.error('Worker error:', err);
                    reject(err);
                };

                worker.onmessage = (e) => {
                    console.log('Worker message:', e.data);
                    const { 
                        type: msgType, 
                        progress: overallProgress, 
                        currentItem: current, 
                        itemProgress: itemProg, 
                        assetType, 
                        assetProgress,
                        itemId,
                        status,
                        isNewQuery: workerNewQuery 
                    } = e.data;
                    
                    if (msgType === 'progress') {
                        // Only update progress if this isn't a new query or if it is a new query
                        if (isNewQuery || !workerNewQuery) {
                            progress.value = Math.min(overallProgress, 100);
                            completedItems.value = current;
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
                                        asset.status = asset.progress === 100 ? 'completed' : status;
                                    }
                                }

                                // Update overall item progress
                                const completedAssets = item.children.filter(c => c.progress === 100).length;
                                item.progress = Math.round((completedAssets / item.children.length) * 100);
                                if (item.progress === 100) {
                                    item.status = 'completed';
                                } else if (status) {
                                    item.status = status;
                                }
                            }
                        }
                    } else if (msgType === 'complete') {
                        resolve(true);
                    } else if (msgType === 'error') {
                        reject(e.data.error);
                    }
                };

                worker.postMessage({ 
                    tasks,
                    baseUrl: currentServer.value?.serverBaseUrl,
                    token: user.value?.accessToken,
                    isNewQuery
                });
            });

        } catch (error) {
            console.error('Download failed:', error);
            return false;
        } finally {
            worker?.terminate();
            isDownloading.value = false;
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
