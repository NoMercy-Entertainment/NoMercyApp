import { addNotification } from '@/store/notifications';
import { pwaMessages } from '@/i18n/pwa';
import type { Message } from '@/types/auth';

function getCurrentLanguage(): string {
	return (
		localStorage.getItem('language') || navigator.language.split('-')[0] || 'en'
	);
}

function createUpdateNotification(): Message {
	const lang = getCurrentLanguage();
	const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

	return {
		id: 'sw-update-pending',
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

let waitingServiceWorker: ServiceWorker | null = null;
let listenersAttached = false;

export function setupServiceWorkerUpdates() {
	if (!('serviceWorker' in navigator)) {
		return;
	}

	// controllerchange listener is registered early in main.ts

	// Check for updates immediately and set up listeners
	navigator.serviceWorker.getRegistration()
		.then((registration) => {
			if (!registration) return;

			setupUpdateListeners(registration);

			// Check if there's already an update waiting
			if (registration.waiting) {
				waitingServiceWorker = registration.waiting;
				showUpdateNotification();
			}

			// Force check for updates
			registration.update().catch(() => {});
		})
		.catch(() => {});

	// Listen for user accepting the update
	document.addEventListener('sw-update-accepted', () => {
		if (waitingServiceWorker) {
			waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
		}
		else {
			window.location.reload();
		}
	});

	// Check for updates periodically
	setInterval(() => {
		navigator.serviceWorker.getRegistration()
			.then((registration) => {
				if (registration) {
					console.log('Checking for updates...');
					registration.update().then();
				}
			})
			.catch((error) => {
				console.log('Periodic update check failed:', error);
			});
	}, 60000); // Check every minute
}

function setupUpdateListeners(registration: ServiceWorkerRegistration) {
	if (listenersAttached) return;
	listenersAttached = true;

	// Listen for new service worker installations
	registration.addEventListener('updatefound', () => {
		console.log('New service worker found!');
		const newWorker = registration.installing;
		if (!newWorker) {
			console.log('No installing worker found');
			return;
		}

		console.log('New worker state:', newWorker.state);

		newWorker.addEventListener('statechange', () => {
			console.log('Service worker state changed to:', newWorker.state);

			if (newWorker.state === 'installed') {
				if (navigator.serviceWorker.controller) {
					// New version is available (update scenario)
					console.log('New version installed, showing notification');
					waitingServiceWorker = newWorker;
					showUpdateNotification();
				}
				else {
					// This is the first install
					console.log('Service worker installed for the first time');
				}
			}
		});
	});
}

function showUpdateNotification() {
	const updateNotification = createUpdateNotification();
	addNotification(updateNotification);
}
