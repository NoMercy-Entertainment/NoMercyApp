import type { Ref } from 'vue';
import { onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import type { Track } from '@nomercy-entertainment/nomercy-video-player/src/types';
import type { ExtendedVideo, InfoResponse } from '@/types/api/base/info';
import type { ResolvedTrailer, TrailerButtonState, TrailerServiceResponse } from '@/types/api/trailerService';

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
const BARE_ID_REGEX = /^[\w-]{11}$/;
const TRAILER_BASE_URL = 'https://trailer.nomercy.tv';
const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 30;

function extractYouTubeId(src: string): string | null {
	const match = src.match(YOUTUBE_ID_REGEX);
	if (match)
		return match[1];
	if (BARE_ID_REGEX.test(src))
		return src;
	return null;
}

function filterTrailerCandidates(videos: ExtendedVideo[]): ExtendedVideo[] {
	return videos
		.filter(v => extractYouTubeId(v.src))
		.sort((a, b) => {
			// Prioritize items with "trailer" in the name
			const aNameTrailer = a.name?.toLowerCase().includes('trailer') ? 1 : 0;
			const bNameTrailer = b.name?.toLowerCase().includes('trailer') ? 1 : 0;
			if (bNameTrailer !== aNameTrailer)
				return bNameTrailer - aNameTrailer;

			// Then by type === 'trailer'
			const aTrailer = a.type?.toLowerCase() === 'trailer' ? 1 : 0;
			const bTrailer = b.type?.toLowerCase() === 'trailer' ? 1 : 0;
			if (bTrailer !== aTrailer)
				return bTrailer - aTrailer;

			// Then by size (largest first)
			if ((b.size ?? 0) !== (a.size ?? 0))
				return (b.size ?? 0) - (a.size ?? 0);

			return (b.official ? 1 : 0) - (a.official ? 1 : 0);
		});
}

function buildSubtitles(subtitles: TrailerServiceResponse['data']['subtitles']): Track[] {
	return subtitles.map((sub, index) => ({
		id: index + 1,
		file: sub.url.startsWith('http') ? sub.url : `${TRAILER_BASE_URL}${sub.url}`,
		kind: 'subtitles',
		language: sub.language,
		label: sub.label,
	}));
}

export function useTrailerService(data: Ref<InfoResponse | undefined>) {
	const buttonState = ref<TrailerButtonState>('idle');
	const trailerOpen = ref(false);
	const resolvedTrailer = ref<ResolvedTrailer | null>(null);

	let abortController: AbortController | null = null;
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	function cleanup() {
		abortController?.abort();
		abortController = null;
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	}

	async function validateCandidate(
		video: ExtendedVideo,
		videoId: string,
		signal: AbortSignal,
		fallbackTitle: string,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${TRAILER_BASE_URL}/${videoId}?v=${Date.now()}`,
				{ signal },
			);

			let result: TrailerServiceResponse = await response.json().catch(() => null);

			if (!result?.success)
				return false;

			// Detect stale metadata (webm exists but info.json was missing on server)
			// and request revalidation to get correct duration/width/height/title
			if (result.data.cached && result.data.duration === 0 && result.data.width === 0 && result.data.height === 0) {
				const revalidateResponse = await fetch(
					`${TRAILER_BASE_URL}/${videoId}?revalidate=1&v=${Date.now()}`,
					{ signal },
				);
				const revalidated: TrailerServiceResponse = await revalidateResponse.json().catch(() => null);
				if (revalidated?.success)
					result = revalidated;
			}

			const apiTitle = result.data.title && result.data.title !== videoId ? result.data.title : fallbackTitle;
			const title = apiTitle.replace(/\\\s*/g, '/').trim();

			if (result.data.cached) {
				resolvedTrailer.value = {
					videoId,
					videoUrl: `${TRAILER_BASE_URL}${result.data.downloadUrl}?v=${Date.now()}`,
					thumbnailUrl: `${TRAILER_BASE_URL}/${videoId}/${videoId}.jpg`,
					title,
					subtitles: buildSubtitles(result.data.subtitles ?? []),
					sourceVideo: video,
				};
				buttonState.value = 'available';
				return true;
			}

			if (result.data.processing) {
				buttonState.value = 'processing';
				return await pollUntilCached(video, videoId, signal, fallbackTitle);
			}

			if (result.status === 'queued') {
				buttonState.value = 'queued';
				return await pollUntilCached(video, videoId, signal, fallbackTitle);
			}

			return false;
		}
		catch {
			return false;
		}
	}

	function pollUntilCached(
		video: ExtendedVideo,
		videoId: string,
		signal: AbortSignal,
		fallbackTitle: string,
	): Promise<boolean> {
		return new Promise((resolve) => {
			let attempts = 0;

			pollTimer = setInterval(async () => {
				if (signal.aborted) {
					clearInterval(pollTimer!);
					pollTimer = null;
					resolve(false);
					return;
				}

				attempts++;
				if (attempts >= MAX_POLL_ATTEMPTS) {
					clearInterval(pollTimer!);
					pollTimer = null;
					resolve(false);
					return;
				}

				try {
					const response = await fetch(
						`${TRAILER_BASE_URL}/${videoId}?v=${Date.now()}`,
						{ signal },
					);

					const result: TrailerServiceResponse = await response.json().catch(() => null);

					if (result?.success && result.data.cached) {
						clearInterval(pollTimer!);
						pollTimer = null;
						resolvedTrailer.value = {
							videoId,
							videoUrl: `${TRAILER_BASE_URL}${result.data.downloadUrl}?v=${Date.now()}`,
							thumbnailUrl: `${TRAILER_BASE_URL}/${videoId}/${videoId}.jpg`,
							title: (result.data.title && result.data.title !== videoId ? result.data.title : fallbackTitle).replace(/\\\s*/g, '/').trim(),
							subtitles: buildSubtitles(result.data.subtitles ?? []),
							sourceVideo: video,
						};
						buttonState.value = 'available';
						resolve(true);
					}
					else if (result?.success && (result.data.processing || result.status === 'processing')) {
						buttonState.value = 'processing';
					}
				}
				catch {
					// Ignore fetch errors during polling (e.g. abort)
				}
			}, POLL_INTERVAL_MS);
		});
	}

	async function validate() {
		cleanup();

		const info = data.value;
		if (!info?.videos || info.videos.length === 0) {
			buttonState.value = 'unavailable';
			return;
		}

		const candidates = filterTrailerCandidates(info.videos);
		if (candidates.length === 0) {
			buttonState.value = 'unavailable';
			return;
		}

		buttonState.value = 'validating';
		abortController = new AbortController();
		const { signal } = abortController;

		const title = info.title ?? info.name ?? '';

		for (const video of candidates) {
			if (signal.aborted)
				return;

			const videoId = extractYouTubeId(video.src);
			if (!videoId)
				continue;

			const videoTitle = `${
				video.name?.toLowerCase().includes(title.toLowerCase())
					? ''
					: `${title} - `
			}${video.name}`;

			const found = await validateCandidate(video, videoId, signal, videoTitle);
			if (found)
				return;
		}

		if (!signal.aborted) {
			buttonState.value = 'unavailable';
		}
	}

	function toggleTrailer(e?: MouseEvent) {
		e?.stopPropagation();
		if (!resolvedTrailer.value)
			return;
		trailerOpen.value = !trailerOpen.value;

		const main = document.querySelector<HTMLDivElement>('#main');
		if (!main)
			return;
		main.style.overflow = trailerOpen.value ? 'hidden' : 'auto';
	}

	function closeTrailer() {
		trailerOpen.value = false;
		const main = document.querySelector<HTMLDivElement>('#main');
		if (main)
			main.style.overflow = 'auto';
	}

	watch(data, () => {
		resolvedTrailer.value = null;
		validate();
	}, { immediate: true });

	onBeforeRouteLeave(() => {
		cleanup();
	});

	onUnmounted(() => {
		cleanup();
	});

	return {
		buttonState,
		trailerOpen,
		resolvedTrailer,
		toggleTrailer,
		closeTrailer,
		validate,
	};
}
