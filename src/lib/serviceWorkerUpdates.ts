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
		id: `sw-update-${Date.now()}`,
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

export function setupServiceWorkerUpdates() {
	if (!('serviceWorker' in navigator)) {
		console.log('Service worker not supported');
		return;
	}

	console.log('Setting up service worker update detection...');

	// Listen for controller changes (indicates new SW took over)
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		console.log('Controller changed - new service worker active');
		// Don't show notification here as it might be the first install
	});

	// Check for updates immediately and set up listeners
	navigator.serviceWorker.getRegistration()
		.then((registration) => {
			if (!registration) {
				console.log('No service worker registration found');
				return;
			}

			console.log('Service worker registration found');
			setupUpdateListeners(registration);

			// Check if there's already an update waiting
			if (registration.waiting) {
				console.log('Update already waiting, showing notification');
				showUpdateNotification();
			}

			// Force check for updates
			registration.update().catch((error) => {
				console.log('Manual update check failed:', error);
			});
		})
		.catch((error) => {
			console.error('Failed to get service worker registration:', error);
		});

	// Also set up when service worker becomes ready
	navigator.serviceWorker.ready
		.then((registration) => {
			console.log('Service worker ready, setting up update detection...');
			setupUpdateListeners(registration);
		})
		.catch((error) => {
			console.error('Service worker ready failed:', error);
		});

	// Listen for user accepting the update
	document.addEventListener('sw-update-accepted', () => {
		console.log('User accepted update, reloading...');
		window.location.reload();
	});

	// Check for updates periodically
	setInterval(() => {
		navigator.serviceWorker.getRegistration()
			.then((registration) => {
				if (registration) {
					console.log('Checking for updates...');
					registration.update();
				}
			})
			.catch((error) => {
				console.log('Periodic update check failed:', error);
			});
	}, 60000); // Check every minute
}

function setupUpdateListeners(registration: ServiceWorkerRegistration) {
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
