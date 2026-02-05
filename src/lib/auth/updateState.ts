const UPDATE_PENDING_KEY = 'nomercy_update_pending';
const UPDATE_VERSION_KEY = 'nomercy_update_version';

export function setUpdatePending(version: string): void {
	sessionStorage.setItem(UPDATE_PENDING_KEY, 'true');
	sessionStorage.setItem(UPDATE_VERSION_KEY, version);
}

export function getUpdatePending(): { pending: boolean; version: string | null } {
	return {
		pending: sessionStorage.getItem(UPDATE_PENDING_KEY) === 'true',
		version: sessionStorage.getItem(UPDATE_VERSION_KEY),
	};
}

export function clearUpdatePending(): void {
	sessionStorage.removeItem(UPDATE_PENDING_KEY);
	sessionStorage.removeItem(UPDATE_VERSION_KEY);
}

export async function checkAndApplyPendingUpdate(): Promise<void> {
	const { pending, version } = getUpdatePending();

	if (!pending || !version) return;

	clearUpdatePending();

	if ('serviceWorker' in navigator) {
		const reg = await navigator.serviceWorker.getRegistration();
		if (reg?.waiting) {
			reg.waiting.postMessage({ type: 'SKIP_WAITING' });
			return;
		}
	}

	window.location.reload();
}
