import { addNotification } from '@/store/notifications';
import { pwaMessages } from '@/i18n/pwa';
import type { Message } from '@/types/auth';

function getCurrentLanguage(): string {
    return localStorage.getItem('language') ||
        navigator.language.split('-')[0] ||
        'en';
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
        link: 'reload' // Special link to indicate reload action
    };
}

export function setupServiceWorkerUpdates() {
    if (!('serviceWorker' in navigator)) {
        console.log('Service worker not supported');
        return;
    }

    // Check for updates when service worker is ready
    navigator.serviceWorker.ready.then(registration => {        
        // Check if there's already an update waiting
        if (registration.waiting) {
            showUpdateNotification();
        }

        // Listen for new service worker installations
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) {
                return;
            }

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New version is available
                    showUpdateNotification();
                }
            });
        });
    }).catch(error => {
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
