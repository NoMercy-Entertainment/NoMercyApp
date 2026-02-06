import { APP_VERSION } from './version';
import { setUpdatePending } from '@/lib/auth/updateState';

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;
const VERSION_ENDPOINT = '/version.json';

interface VersionInfo {
	version: string;
	buildTime: string;
	forceUpdate?: boolean;
}

let checkInterval: number | null = null;

async function clearCachesAndReload(): Promise<void> {
	try {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}
		if ('serviceWorker' in navigator) {
			const reg = await navigator.serviceWorker.getRegistration();
			if (reg?.waiting) {
				reg.waiting.postMessage({ type: 'SKIP_WAITING' });
			}
		}
	}
	catch {
		// Best effort
	}

	window.location.reload();
}

export async function checkForUpdates(): Promise<boolean> {
	try {
		const response = await fetch(VERSION_ENDPOINT, {
			cache: 'no-store',
			headers: { 'Cache-Control': 'no-cache' },
		});

		if (!response.ok) return false;

		const contentType = response.headers.get('content-type') ?? '';
		if (!contentType.includes('application/json')) return false;

		const serverVersion: VersionInfo = await response.json();

		if (serverVersion.version !== APP_VERSION) {
			setUpdatePending(serverVersion.version);

			// Version mismatch means old chunks will 404 — clear caches and reload
			clearCachesAndReload();
			return true;
		}

		return false;
	}
	catch (error) {
		console.error('Version check failed:', error);
		return false;
	}
}

export function startVersionChecks(): void {
	// Initial check is done early in main.ts; this sets up periodic checks only
	checkInterval = window.setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);

	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
			checkForUpdates();
		}
	});
}

export function stopVersionChecks(): void {
	if (checkInterval) {
		clearInterval(checkInterval);
		checkInterval = null;
	}
}
