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
	const messages
    = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

	return {
		id: `sw-update-${Date.now()}`,
		type: 'update',
		title: messages.newVersion,
		body: messages.updateNow,
		from: 'system',
		read: false,
		created_at: Date.now(),
		updated_at: Date.now(),
		notify: true,
		link: 'reload', // Special link to indicate reload action
	};
}

export function setupServiceWorkerUpdates() {
	if (!('serviceWorker' in navigator)) {
		console.log('Service worker not supported');
		return;
	}

	console.log('Setting up service worker update detection...');

	// Check for updates when service worker is ready
	navigator.serviceWorker.ready
		.then((registration) => {
			console.log('Service worker ready, checking for updates...');

			// Check if there's already an update waiting
			if (registration.waiting) {
				console.log('Update already waiting, showing notification');
				showUpdateNotification();
			}
			else {
				console.log('No update waiting');
			}

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

					if (
						newWorker.state === 'installed'
						&& navigator.serviceWorker.controller
					) {
						// New version is available
						console.log('New version installed, showing notification');
						showUpdateNotification();
					}
					else if (newWorker.state === 'installed') {
						console.log(
							'Service worker installed but no controller (first install)',
						);
					}
				});
			});
		})
		.catch((error) => {
			console.error('Service worker ready failed:', error);
		});

	// Listen for user accepting the update
	document.addEventListener('sw-update-accepted', () => {
		console.log('User accepted update, reloading...');
		window.location.reload();
	});
}

function showUpdateNotification() {
	const updateNotification = createUpdateNotification();
	addNotification(updateNotification);
}
