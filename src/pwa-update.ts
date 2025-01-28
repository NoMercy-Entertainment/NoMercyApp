import { pwaMessages } from './i18n/pwa';

function getCurrentLanguage(): string {
    return localStorage.getItem('language') || 
           navigator.language.split('-')[0] || 
           'en';
}

export function registerPWAUpdate() {
    window.addEventListener('pwa-refresh', () => {
        const lang = getCurrentLanguage();
        const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 16px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 9999;
        `;
        notification.innerHTML = `
            ${messages.newVersion}
            <button onclick="window.location.reload()" 
                    style="margin-left: 16px; padding: 4px 8px;">
                ${messages.updateNow}
            </button>
        `;
        document.body.appendChild(notification);
    });
}
