const MIGRATION_VERSION = 'v2';
const MIGRATION_KEY = 'nomercy_cache_migration';

export async function runCacheMigration(): Promise<void> {
	const currentMigration = localStorage.getItem(MIGRATION_KEY);

	if (currentMigration === MIGRATION_VERSION) {
		return;
	}

	console.log('Running cache migration...');

	try {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}

		if ('serviceWorker' in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations();
			await Promise.all(registrations.map(reg => reg.unregister()));
		}

		localStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION);

		console.log('Cache migration complete, reloading...');
		window.location.reload();
	}
	catch (error) {
		console.error('Cache migration failed:', error);
		try {
			localStorage.clear();
			localStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION);
		}
		catch {
			// Storage completely unavailable, skip migration
		}
	}
}
