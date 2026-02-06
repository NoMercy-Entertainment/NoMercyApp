import { APP_VERSION } from './version';
import { addNotification } from '@/store/notifications';
import { pwaMessages } from '@/i18n/pwa';
import { setUpdatePending } from '@/lib/auth/updateState';
import type { Message } from '@/types/auth';

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;
const VERSION_ENDPOINT = '/version.json';
const AUTO_UPDATE_DELAY = 30 * 60 * 1000;

interface VersionInfo {
	version: string;
	buildTime: string;
	forceUpdate?: boolean;
}

let checkInterval: number | null = null;
let autoUpdateTimeout: number | null = null;

function getCurrentLanguage(): string {
	return (
		localStorage.getItem('language') || navigator.language.split('-')[0] || 'en'
	);
}

function createVersionUpdateNotification(): Message {
	const lang = getCurrentLanguage();
	const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

	return {
		id: `version-update-${Date.now()}`,
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
}

function forceUpdate(): void {
	navigator.serviceWorker.getRegistration().then((reg) => {
		if (reg?.waiting) {
			reg.waiting.postMessage({ type: 'SKIP_WAITING' });
		}
	});

	setTimeout(() => {
		window.location.reload();
	}, 100);
}

function showUpdateAvailable(): void {
	addNotification(createVersionUpdateNotification());

	if (autoUpdateTimeout) {
		clearTimeout(autoUpdateTimeout);
	}

	autoUpdateTimeout = window.setTimeout(() => {
		navigator.serviceWorker.getRegistration().then((reg) => {
			if (reg?.waiting) {
				reg.waiting.postMessage({ type: 'SKIP_WAITING' });
			}
			else {
				window.location.reload();
			}
		});
	}, AUTO_UPDATE_DELAY);
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

			if (serverVersion.forceUpdate) {
				forceUpdate();
				return true;
			}

			showUpdateAvailable();
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
	checkForUpdates();

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
	if (autoUpdateTimeout) {
		clearTimeout(autoUpdateTimeout);
		autoUpdateTimeout = null;
	}
}
