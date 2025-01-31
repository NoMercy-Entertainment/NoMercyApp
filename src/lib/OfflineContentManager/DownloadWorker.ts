import { Parser } from 'm3u8-parser';

interface WorkerTask {
    mediaId: string;
    mediaType: 'video' | 'music';
    mediaPath: string;
    subtitlePaths?: string[];
    fontPaths?: string[];
    previewPaths?: string[];
}

interface ControlMessage {
    type: 'pause' | 'resume' | 'pauseItem' | 'resumeItem';
    itemId?: string;
    pausedIds?: string[];  // Add this line
}

interface WorkerMessage {
    tasks: WorkerTask[];
    baseUrl: string;
    token: string;
    controls?: ControlMessage;
}

interface ProgressMessage {
    type: 'progress';
    progress: number;      // Overall progress 0-100
    currentItem: number;   // Current item being processed
    totalItems: number;    // Total number of items
    itemProgress: number;  // Progress of current item 0-100
}

interface AssetProgress {
    type: 'video' | 'audio' | 'subtitle' | 'preview' | 'font';
    total: number;
    completed: number;
}

let isPaused = false;
let pausedItems = new Set<string>();
let cache: Cache | null = null;
let currentDownloads: { taskIndex: number; promise: Promise<any> }[] = [];

// Simple fetch client that doesn't depend on localStorage
async function fetchWithAuth(path: string, baseUrl: string, token: string) {
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response;
}

// Update the checkPause helper to be more reliable
async function checkPause(taskId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isPaused || (taskId && pausedItems.has(taskId))) {
            reject(new Error('paused'));
        } else {
            resolve();
        }
    });
}

// Add helper to update download status
function updateItemStatus(taskId: string, status: string) {
    self.postMessage({
        type: 'status',
        itemId: taskId,
        status
    });
}

// Track completed assets per item
const completedAssets = new Map<string, Set<string>>();

// Track completed segments per item
const completedSegments = new Map<string, Set<string>>();

// Function to generate unique cache keys
function getCacheKey(mediaId: string, path: string): string {
    return `${mediaId}:${path}`;
}

// Function to check cache and mark completed segments
async function checkCacheForCompletedSegments(
    mediaId: string,
    manifests: { path: string; segments: any[] }[],
    type: AssetProgress['type'],
    completedSegments: Set<string>
): Promise<number> {
    let completedCount = 0;

    for (const manifest of manifests) {
        const basePath = manifest.path.substring(0, manifest.path.lastIndexOf('/'));
        
        for (const segment of manifest.segments) {
            const segmentUrl = segment.uri.startsWith('http')
                ? segment.uri
                : `${basePath}/${segment.uri}`;
            
            const segmentKey = getCacheKey(mediaId, segmentUrl);
            const hasSegment = await cache.match(segmentKey);
            
            if (hasSegment) {
                completedSegments.add(segmentKey);
                completedCount++;
            }
        }
    }

    return completedCount;
}

async function downloadContent(task: WorkerTask, baseUrl: string, token: string, taskIndex: number, totalActiveTasks: number) {
    if (!cache) {
        cache = await caches.open('offline-content-v1');
    }

    // Add pause check at start
    await checkPause(task.mediaId);
    if (isPaused || pausedItems.has(task.mediaId)) {
        return false;
    }

    const assetProgress = new Map<string, AssetProgress>();

    // Initialize or get completed assets for this item
    if (!completedAssets.has(task.mediaId)) {
        completedAssets.set(task.mediaId, new Set());
    }
    const itemCompletedAssets = completedAssets.get(task.mediaId)!;

    // Initialize or get completed segments for this item
    if (!completedSegments.has(task.mediaId)) {
        completedSegments.set(task.mediaId, new Set());
    }
    const itemCompletedSegments = completedSegments.get(task.mediaId)!;

    const updateAssetProgress = (type: AssetProgress['type'], total: number, initialCompleted: number = 0) => {
        if (!assetProgress.has(type)) {
            const progress = { type, total, completed: initialCompleted };
            assetProgress.set(type, progress);
            
            // Send initial progress update with status 'downloading' instead of 'pending'
            const overallProgress = calculateProgress();
            self.postMessage({
                type: 'progress',
                progress: overallProgress.progress,
                currentItem: overallProgress.completedItems,
                totalItems: overallProgress.totalItems,
                itemProgress: Math.round((initialCompleted / total) * 100),
                assetType: type,
                assetProgress: Math.round((initialCompleted / total) * 100),
                itemId: task.mediaId,
                status: 'downloading' // Always start as downloading
            });

            // Only mark as completed if truly done
            if (initialCompleted === total && type !== 'video' && type !== 'audio') {
                itemCompletedAssets.add(type);
            }
        }
    };

    const incrementAssetProgress = (type: AssetProgress['type']) => {
        const progress = assetProgress.get(type);
        if (progress) {
            progress.completed++;
            const percentage = Math.round((progress.completed / progress.total) * 100);
            
            // Only mark asset as complete if it's truly finished AND not a segmented asset
            if (percentage === 100 && type !== 'video' && type !== 'audio') {
                itemCompletedAssets.add(type);
            }
            
            // Don't mark video/audio as completed until all segments are processed
            const isSegmentedAsset = type === 'video' || type === 'audio';
            const isFullyComplete = percentage === 100 && !isSegmentedAsset;
            
            // Calculate overall progress
            const overallProgress = calculateProgress();
            
            self.postMessage({
                type: 'progress',
                progress: overallProgress.progress,
                currentItem: overallProgress.completedItems,
                totalItems: overallProgress.totalItems,
                itemProgress: percentage,
                assetType: type,
                assetProgress: percentage,
                itemId: task.mediaId,
                status: isFullyComplete ? 'completed' : 'downloading'
            });

            // Only update completion status after all segments are actually downloaded
            if (percentage === 100 && !isSegmentedAsset) {
                // ...rest of completion logic...
            }
        }
    };

    try {
        // Add pause check before each major operation
        await checkPause(task.mediaId);

        if (task.mediaPath.includes('.m3u8')) {
            const manifestUrl = `${baseUrl}${task.mediaPath}`;
            const manifestResponse = await fetchWithAuth(task.mediaPath, baseUrl, token);
            const manifest = await manifestResponse.text();

            const parser = new Parser();
            parser.push(manifest);
            parser.end();

            const parsedManifest = parser.manifest;
            const basePath = task.mediaPath.substring(0, task.mediaPath.lastIndexOf('/'));

            // First handle video playlists and count total segments
            let totalVideoSegments = 0;
            const videoManifests: { path: string; segments: any[] }[] = [];

            // If we have playlists, this is a master manifest
            if (parsedManifest.playlists?.length) {
                for (const playlist of parsedManifest.playlists) {
                    const playlistPath = playlist.uri.startsWith('http')
                        ? playlist.uri
                        : `${basePath}/${playlist.uri}`;

                    const playlistResponse = await fetchWithAuth(playlistPath, baseUrl, token);
                    const playlistManifest = await playlistResponse.text();

                    const playlistParser = new Parser();
                    playlistParser.push(playlistManifest);
                    playlistParser.end();

                    if (playlistParser.manifest.segments?.length) {
                        totalVideoSegments += playlistParser.manifest.segments.length;
                        videoManifests.push({
                            path: playlistPath,
                            segments: playlistParser.manifest.segments
                        });
                    }
                }
            } 
            // If we have segments directly, this is a variant manifest
            else if (parsedManifest.segments?.length) {
                totalVideoSegments = parsedManifest.segments.length;
                videoManifests.push({
                    path: task.mediaPath,
                    segments: parsedManifest.segments
                });
            }

            // Process video segments if we have any
            if (totalVideoSegments > 0) {
                // Check cache for already completed video segments
                const completedVideoSegments = await checkCacheForCompletedSegments(
                    task.mediaId, 
                    videoManifests, 
                    'video',
                    itemCompletedSegments
                );
                updateAssetProgress('video', totalVideoSegments, completedVideoSegments);

                // Only process segments that aren't already completed
                for (const manifest of videoManifests) {
                    const videoBasePath = manifest.path.substring(0, manifest.path.lastIndexOf('/'));

                    for (const segment of manifest.segments) {
                        await checkPause(task.mediaId);
                        const segmentUrl = segment.uri.startsWith('http')
                            ? segment.uri
                            : `${videoBasePath}/${segment.uri}`;

                        // Skip if this segment is already downloaded
                        const segmentKey = getCacheKey(task.mediaId, segmentUrl);
                        
                        if (itemCompletedSegments.has(segmentKey)) {
                            // Skip this segment entirely as it's already counted in completedVideoSegments
                            continue;
                        }
                        
                        const hasSegment = await cache.match(segmentKey);
                        if (hasSegment) {
                            itemCompletedSegments.add(segmentKey);
                            // Skip this segment entirely as it's already counted in completedVideoSegments
                            continue;
                        }
                        
                        await checkPause(task.mediaId);
                        const response = await fetchWithAuth(segmentUrl, baseUrl, token).then(r => r.blob());
                        const responseClone = new Response(response.slice(0));
                        await cache.put(segmentKey, responseClone);
                        itemCompletedSegments.add(segmentKey);
                        incrementAssetProgress('video');
                    }
                }
            }

            // Handle audio segments
            if (parsedManifest.mediaGroups?.AUDIO) {
                // First count total audio segments across all languages
                let totalAudioSegments = 0;
                const audioManifests: { path: string; segments: any[] }[] = [];
                
                // First pass: gather all audio manifests and count total segments
                for (const group of Object.values(parsedManifest.mediaGroups.AUDIO)) {
                    for (const audio of Object.values(group)) {
                        if (!audio.uri) continue;

                        const audioManifestPath = audio.uri.startsWith('http')
                            ? audio.uri
                            : `${basePath}/${audio.uri}`;

                        const audioResponse = await fetchWithAuth(audioManifestPath, baseUrl, token);
                        const audioManifest = await audioResponse.text();

                        const audioParser = new Parser();
                        audioParser.push(audioManifest);
                        audioParser.end();

                        if (audioParser.manifest.segments?.length) {
                            totalAudioSegments += audioParser.manifest.segments.length;
                            audioManifests.push({
                                path: audioManifestPath,
                                segments: audioParser.manifest.segments
                            });
                        }
                    }
                }

                // Initialize progress with total segments from all audio tracks
                if (totalAudioSegments > 0) {
                    // Check cache for already completed audio segments
                    const completedAudioSegments = await checkCacheForCompletedSegments(
                        task.mediaId, 
                        audioManifests, 
                        'audio',
                        itemCompletedSegments
                    );
                    updateAssetProgress('audio', totalAudioSegments, completedAudioSegments);

                    // Second pass: download all segments that aren't already completed
                    for (const manifest of audioManifests) {
                        const audioBasePath = manifest.path.substring(0, manifest.path.lastIndexOf('/'));

                        for (const segment of manifest.segments) {
                            await checkPause(task.mediaId);
                            const segmentUrl = segment.uri.startsWith('http')
                                ? segment.uri
                                : `${audioBasePath}/${segment.uri}`;

                            // Skip if this segment is already downloaded
                            const segmentKey = getCacheKey(task.mediaId, segmentUrl);
                            
                            if (itemCompletedSegments.has(segmentKey)) {
                                // Skip this segment entirely as it's already counted in completedAudioSegments
                                continue;
                            }
                            
                            const hasSegment = await cache.match(segmentKey);
                            if (hasSegment) {
                                itemCompletedSegments.add(segmentKey);
                                // Skip this segment entirely as it's already counted in completedAudioSegments
                                continue;
                            }
                            
                            await checkPause(task.mediaId);
                            const response = await fetchWithAuth(segmentUrl, baseUrl, token).then(r => r.blob());
                            const responseClone = new Response(response.slice(0));
                            await cache.put(segmentKey, responseClone);
                            itemCompletedSegments.add(segmentKey);
                            incrementAssetProgress('audio');
                        }
                    }
                }
            }
        } else {
            // Check if we already have the video file
            const videoKey = getCacheKey(task.mediaId, task.mediaPath);
            const hasVideo = await cache.match(videoKey);
            
            // Only download video if not already cached
            if (!hasVideo) {
                // Download video file
                const videoUrl = `${baseUrl}${task.mediaPath}`;
                const response = await fetch(videoUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to download video: ${response.statusText}`);
                }

                await cache.put(videoKey, response.clone());
                
                // Mark video as completed
                itemCompletedAssets.add('video');
                
                self.postMessage({
                    type: 'progress',
                    progress: calculateProgress().progress,
                    currentItem: calculateProgress().completedItems,
                    totalItems: calculateProgress().totalItems,
                    itemProgress: 100,
                    assetType: 'video',
                    assetProgress: 100,
                    itemId: task.mediaId,
                    status: 'downloading'
                });
            } else {
                // If video was already cached, mark it as completed
                itemCompletedAssets.add('video');
                self.postMessage({
                    type: 'progress',
                    progress: calculateProgress().progress,
                    currentItem: calculateProgress().completedItems,
                    totalItems: calculateProgress().totalItems,
                    itemProgress: 100,
                    assetType: 'video',
                    assetProgress: 100,
                    itemId: task.mediaId,
                    status: 'downloading'
                });
            }
        }

        // Initialize and track other assets
        if (task.subtitlePaths?.length) {
            updateAssetProgress('subtitle', task.subtitlePaths.length);
            for (const path of task.subtitlePaths) {
                // Skip if this subtitle is already downloaded
                const subtitleKey = getCacheKey(task.mediaId, path);
                const hasSubtitle = await cache.match(subtitleKey);
                
                if (!hasSubtitle) {
                    await checkPause(task.mediaId);
                    const response = await fetchWithAuth(path, baseUrl, token);
                    await cache.put(subtitleKey, response.clone());
                }
                
                incrementAssetProgress('subtitle');
            }
        }

        if (task.previewPaths?.length) {
            updateAssetProgress('preview', task.previewPaths.length);
            for (const path of task.previewPaths) {
                // Skip if this preview is already downloaded
                const previewKey = getCacheKey(task.mediaId, path);
                const hasPreview = await cache.match(previewKey);
                
                if (!hasPreview) {
                    await checkPause(task.mediaId);
                    const response = await fetchWithAuth(path, baseUrl, token);
                    await cache.put(previewKey, response.clone());
                }
                
                incrementAssetProgress('preview');
            }
        }

        if (task.fontPaths?.length) {
            let totalFontFiles = 0;
            const fontPaths = [];

            // Fetch fonts.json and count total font files
            for (const path of task.fontPaths) {
                const response = await fetchWithAuth(path, baseUrl, token);
                const fonts = await response.json();
                totalFontFiles += fonts.length;
                fontPaths.push({ path, fonts });
            }

            updateAssetProgress('font', totalFontFiles);

            for (const { path, fonts } of fontPaths) {
                const fontKey = getCacheKey(task.mediaId, path);
                const hasFont = await cache.match(fontKey);
                
                if (!hasFont) {
                    await checkPause(task.mediaId);
                    const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                    
                    for (const font of fonts) {
                        await checkPause(task.mediaId);
                        const fontUrl = `${basePath}fonts/${font.file}`;
                        const fontFileKey = getCacheKey(task.mediaId, fontUrl);
                        
                        // Check if this specific font file is already cached
                        const hasFontFile = await cache.match(fontFileKey);
                        if (!hasFontFile) {
                            const fontResponse = await fetchWithAuth(fontUrl, baseUrl, token);
                            await cache.put(fontFileKey, fontResponse.clone());
                            incrementAssetProgress('font'); // Increment progress for each font file
                        } else {
                            incrementAssetProgress('font'); // Increment progress if font is already cached
                        }
                    }
                    
                    // Cache the manifest after processing all font files
                    await cache.put(fontKey, new Response(JSON.stringify(fonts)));
                } else {
                    // Increment progress for each font file in the cached manifest
                    fonts.forEach(() => incrementAssetProgress('font'));
                }
            }
        }
    } catch (error) {
        if (error?.message === 'paused') {
            return false;
        }
        throw error;
    }
}

// Keep track of initial tasks
let originalTasks: WorkerTask[] = [];
let baseUrl: string = '';
let token: string = '';

// Update the processQueue function to handle pauses more reliably
async function processQueue(tasks: WorkerTask[], baseUrl: string, token: string) {
    let index = 0;
    
    while (index < tasks.length) {
        const task = tasks[index];
        
        // Set current task to downloading and next tasks to waiting
        updateItemStatus(task.mediaId, 'downloading');
        tasks.slice(index + 1).forEach(nextTask => {
            if (!completedItems.get(nextTask.mediaId) && !pausedItems.has(nextTask.mediaId)) {
                updateItemStatus(nextTask.mediaId, 'waiting');
            }
        });

        try {
            // Check pause state before starting each task
            if (isPaused) {
                updateItemStatus(task.mediaId, 'paused');
                return; // Exit the queue entirely when globally paused
            }
            
            if (pausedItems.has(task.mediaId)) {
                updateItemStatus(task.mediaId, 'paused');
                index++;
                continue; // Skip this task but continue with others
            }

            // Track current download
            const taskIndex = originalTasks.indexOf(task);
            currentDownloads = [{
                taskIndex,
                promise: downloadContent(task, baseUrl, token, taskIndex, tasks.length)
            }];

            updateItemStatus(task.mediaId, 'downloading');
            const result = await currentDownloads[0].promise;
            
            if (result === false) {
                // Task was paused
                updateItemStatus(task.mediaId, 'paused');
                if (isPaused) return; // Exit queue if globally paused
                index++; // Move to next task if individually paused
            } else {
                // Task completed successfully
                updateItemStatus(task.mediaId, 'completed');
                index++;
            }
        } catch (error) {
            if (error?.message === 'paused') {
                updateItemStatus(task.mediaId, 'paused');
                if (isPaused) return; // Exit queue if globally paused
                index++; // Move to next task if individually paused
            } else {
                updateItemStatus(task.mediaId, 'error');
                throw error;
            }
        }
    }

    // Only send complete if there are no paused items
    const pausedCount = tasks.filter(t => pausedItems.has(t.mediaId)).length;
    if (pausedCount === 0) {
        const progress = calculateProgress();
        self.postMessage({ 
            type: 'complete',
            progress: progress.progress,
            currentItem: progress.completedItems,
            totalItems: progress.totalItems
        });
    }
}

// Add a set to track completed items and their completion status
let completedItems = new Map<string, boolean>(); // mediaId -> isFullyCompleted

// Add a function to calculate overall progress
function calculateProgress() {
    // Count fully completed items
    const completedCount = Array.from(completedItems.values()).filter(isComplete => isComplete).length;
    
    // Calculate progress including partially completed items
    let totalProgress = 0;
    originalTasks.forEach((task) => {
        if (completedItems.get(task.mediaId)) {
            // If item is fully completed, add 100%
            totalProgress += 100;
        } else if (completedAssets.has(task.mediaId)) {
            // Calculate total required assets for this task
            const requiredAssets = new Set(['video']);
            if (task.subtitlePaths?.length) requiredAssets.add('subtitle');
            if (task.fontPaths?.length) requiredAssets.add('font');
            if (task.previewPaths?.length) requiredAssets.add('preview');
            
            // Calculate progress based on completed required assets
            const assets = completedAssets.get(task.mediaId)!;
            const completedRequired = Array.from(requiredAssets).filter(type => assets.has(type)).length;
            totalProgress += (completedRequired / requiredAssets.size) * 100;
        }
    });
    
    return {
        progress: Math.round(totalProgress / originalTasks.length),
        completedItems: completedCount,
        totalItems: originalTasks.length
    };
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { tasks, controls } = e.data;

    // Store initial config
    if (tasks) {
        originalTasks = tasks;
        baseUrl = e.data.baseUrl;
        token = e.data.token;
        // Reset tracking sets
        completedItems.clear();
        pausedItems.clear();
    }

    // Update the message handler to be more robust with pause/resume
    if (controls) {
        const { type, itemId } = controls;
        
        switch (type) {
            case 'pause':
                isPaused = true;
                // Only pause non-completed items
                originalTasks.forEach(task => {
                    const isCompleted = completedItems.get(task.mediaId);
                    if (!isCompleted) {
                        pausedItems.add(task.mediaId);
                        self.postMessage({
                            type: 'status',
                            itemId: task.mediaId,
                            status: 'paused'
                        });
                    }
                });
                break;
                
            case 'resume':
                isPaused = false;
                pausedItems.clear();
                
                // Only resume tasks that were explicitly paused
                const pausedIds = controls.pausedIds || [];
                const remainingTasks = originalTasks.filter(t => 
                    !completedItems.get(t.mediaId) && 
                    pausedIds.includes(t.mediaId)
                );
                
                if (remainingTasks.length) {
                    remainingTasks.forEach(task => {
                        updateItemStatus(task.mediaId, 'pending');
                    });
                    try {
                        await processQueue(remainingTasks, baseUrl, token);
                    } catch (error) {
                        console.error('Failed to resume queue:', error);
                    }
                }
                break;

            case 'pauseItem':
                if (itemId) {
                    pausedItems.add(itemId);
                    updateItemStatus(itemId, 'paused');
                }
                break;
                
            case 'resumeItem':
                if (itemId) {
                    pausedItems.delete(itemId);
                    updateItemStatus(itemId, 'pending');
                    
                    const task = originalTasks.find(t => t.mediaId === itemId);
                    if (task && !completedItems.get(task.mediaId)) {
                        try {
                            const tempPaused = isPaused;
                            isPaused = false;
                            await processQueue([task], baseUrl, token);
                            isPaused = tempPaused;
                        } catch (error) {
                            console.error('Failed to resume item:', error);
                            updateItemStatus(itemId, 'error');
                        }
                    }
                }
                break;
        }
        return;
    }

    // Initial start of queue processing - filter out any completed items
    const nonCompletedTasks = tasks.filter(t => !completedItems.get(t.mediaId));
    processQueue(nonCompletedTasks, baseUrl, token);
};
