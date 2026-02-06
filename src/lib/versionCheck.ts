import { APP_VERSION } from './version';
import { setUpdatePending } from '@/lib/auth/updateState';
import { addNotification } from '@/store/notifications';
import { pwaMessages } from '@/i18n/pwa';
import type { Message } from '@/types/auth';

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;
const VERSION_ENDPOINT = '/version.json';

interface VersionInfo {
	version: string;
	buildTime: string;
	forceUpdate?: boolean;
}

let checkInterval: number | null = null;

function getCurrentLanguage(): string {
	return (
		localStorage.getItem('language') || navigator.language.split('-')[0] || 'en'
	);
}

function showVersionUpdateNotification(): void {
	const lang = getCurrentLanguage();
	const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

	const notification: Message = {
		id: 'version-update-pending',
		type: 'update',
		title: messages.newVersion,
		body: messages.updateNow,
		from: 'system',
		read: false,
		created_at: Date.now(),
		updated_at: Date.now(),
		notify: true,
		link: 'reload',
	};

	addNotification(notification);
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

			// Show notification so the user can reload when ready.
			// Never force-reload — chunkErrorRecovery.ts handles that
			// transparently when stale chunks 404 on navigation.
			showVersionUpdateNotification();
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
