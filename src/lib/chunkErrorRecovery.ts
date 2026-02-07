const RECOVERY_KEY = 'nomercy_chunk_recovery';

async function clearCachesAndReload(): Promise<void> {
	// Prevent infinite reload loops — only recover once per session
	if (sessionStorage.getItem(RECOVERY_KEY)) return;
	sessionStorage.setItem(RECOVERY_KEY, '1');

	try {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}

		if ('serviceWorker' in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations();
			await Promise.all(registrations.map(reg => reg.unregister()));
		}
	}
	catch {
		// Best effort — reload anyway
	}

	window.location.reload();
}

function isChunkError(message: string): boolean {
	const lower = message.toLowerCase();
	return lower.includes('loading chunk')
		|| lower.includes('failed to fetch dynamically imported module')
		|| lower.includes('importing a module script failed')
		|| lower.includes('error loading dynamically imported module')
		|| lower.includes('failed to load module script')
		|| (lower.includes('load failed') && lower.includes('module'))
		|| (lower.includes('syntaxerror') && lower.includes('expected'));
}

export function setupChunkErrorRecovery(): void {
	// Catch synchronous script errors (e.g. <script> 404s)
	window.addEventListener('error', (event) => {
		// Script load failures fire as ErrorEvents on the element, not window.onerror
		// They have no .message but the target is a <script> or <link> element
		const target = event.target as HTMLElement | null;
		if (target?.tagName === 'SCRIPT' || target?.tagName === 'LINK') {
			console.error('Asset load failed:', (target as HTMLScriptElement).src || (target as HTMLLinkElement).href);
			clearCachesAndReload();
			return;
		}

		if (event.message && isChunkError(event.message)) {
			console.error('Chunk loading failed:', event.message);
			clearCachesAndReload();
		}
	}, true); // useCapture: true to catch errors on child elements

	// Catch rejected dynamic import() promises
	window.addEventListener('unhandledrejection', (event) => {
		const reason = event.reason;
		const message = reason?.message || String(reason || '');

		if (isChunkError(message)) {
			console.error('Chunk loading failed (promise):', message);
			clearCachesAndReload();
			return;
		}

		// Also catch TypeError from failed fetch (network error on dynamic import)
		if (reason instanceof TypeError && /fetch|module|chunk|import/i.test(message)) {
			console.error('Module fetch failed:', message);
			clearCachesAndReload();
		}
	});
}
