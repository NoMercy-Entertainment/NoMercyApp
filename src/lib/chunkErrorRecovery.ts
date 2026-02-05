let hasRecovered = false;

async function clearCachesAndReload(): Promise<void> {
	try {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}

		if ('serviceWorker' in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations();
			await Promise.all(registrations.map(reg => reg.unregister()));
		}

		localStorage.removeItem('nomercy_cache_health');
	}
	catch (error) {
		console.error('Cache clear failed:', error);
	}

	window.location.reload();
}

function isChunkError(message: string): boolean {
	return message.includes('Loading chunk')
		|| message.includes('Failed to fetch dynamically imported module')
		|| message.includes('Importing a module script failed');
}

export function setupChunkErrorRecovery(): void {
	window.addEventListener('error', (event) => {
		if (event.message && isChunkError(event.message) && !hasRecovered) {
			hasRecovered = true;
			console.error('Chunk loading failed, clearing cache and reloading...');
			clearCachesAndReload();
		}
	});

	window.addEventListener('unhandledrejection', (event) => {
		const reason = event.reason?.message || String(event.reason);

		if (isChunkError(reason) && !hasRecovered) {
			hasRecovered = true;
			console.error('Chunk loading failed (promise), clearing cache and reloading...');
			clearCachesAndReload();
		}
	});
}
