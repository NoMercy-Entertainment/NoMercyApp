import { queryClient } from '@/config/tanstack-query';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import type { RouteLocationNormalized } from 'vue-router';

// Routes that should prefetch their data
const PREFETCH_ROUTES: Record<string, string[]> = {
	// When on Home, prefetch common navigation targets
	Home: ['/libraries', '/music'],
	// When on Libraries index, prefetch first few library pages
	Libraries: [],
	// When on a library page, prefetch the collection/item details
};

// Cooldown to prevent excessive prefetching
const prefetchCooldown = new Map<string, number>();
const COOLDOWN_MS = 30000; // 30 seconds

function canPrefetch(path: string): boolean {
	const lastPrefetch = prefetchCooldown.get(path);
	if (lastPrefetch && Date.now() - lastPrefetch < COOLDOWN_MS) {
		return false;
	}
	return true;
}

function markPrefetched(path: string): void {
	prefetchCooldown.set(path, Date.now());
}

async function prefetchPath(path: string): Promise<void> {
	if (!currentServer.value?.serverApiUrl || !canPrefetch(path)) {
		return;
	}

	const queryKey = path.split('/').filter(Boolean);

	// Check if already cached and fresh
	const existingData = queryClient.getQueryData(queryKey);
	if (existingData) {
		return;
	}

	markPrefetched(path);

	try {
		await queryClient.prefetchQuery({
			queryKey,
			queryFn: async () => {
				const response = await serverClient().get<{ data: unknown }>(path);
				return response.data?.data ?? response.data;
			},
			staleTime: 1000 * 60 * 5, // 5 minutes
		});
	}
	catch {
		// Silently fail prefetch - it's just an optimization
	}
}

export function prefetchRedirectRoute(path: string): void {
	const normalizedPath = path === '/' ? '/home' : path;
	prefetchPath(normalizedPath);
}

export function prefetchForRoute(route: RouteLocationNormalized): void {
	const routeName = route.name as string;
	const pathsToPrefetch = PREFETCH_ROUTES[routeName];

	if (!pathsToPrefetch || pathsToPrefetch.length === 0) {
		return;
	}

	// Use requestIdleCallback to avoid blocking
	requestIdleCallback(() => {
		pathsToPrefetch.forEach((path) => {
			prefetchPath(path);
		});
	});
}

export function prefetchOnHover(path: string): void {
	setTimeout(() => {
		prefetchPath(path);
	}, 100);
}

// Prefetch adjacent items in a list (e.g., next/prev in a collection)
export function prefetchAdjacent(currentPath: string, items: Array<{ link?: string }>): void {
	const currentIndex = items.findIndex(item => item.link === currentPath);
	if (currentIndex === -1)
		return;

	const adjacentPaths: string[] = [];

	// Prefetch next 2 items
	for (let i = 1; i <= 2; i++) {
		const nextItem = items[currentIndex + i];
		if (nextItem?.link) {
			adjacentPaths.push(nextItem.link);
		}
	}

	// Prefetch previous item
	const prevItem = items[currentIndex - 1];
	if (prevItem?.link) {
		adjacentPaths.push(prevItem.link);
	}

	requestIdleCallback(() => {
		adjacentPaths.forEach(path => prefetchPath(path));
	});
}
